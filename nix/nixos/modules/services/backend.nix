{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.campusmedius.backend;
  uwsgi = pkgs.cm-backend.uwsgi;
  pythonenv = pkgs.cm-backend.pythonenv;
  
  env = {
        PYTHONPATH = "${pythonenv}/lib/${pythonenv.libPrefix}:${pythonenv}/${pythonenv.sitePackages}:${pythonenv}/lib/${pythonenv.libPrefix}/lib-dynload";
        DJANGO_SETTINGS_MODULE = "campusmedius.settings";
        ALLOWED_HOSTS="${concatStringsSep " " cfg.djangoAllowedHosts}";
        CORS_ORIGIN_ALLOW_ALL="${boolToString cfg.CORSAllowAll}";
        DB_PATH="${cfg.dataDir}/db.sqlite3";
        MEDIA_ROOT="${cfg.mediaDir}";
  };
in
with lib;
{
  options = {
    services.campusmedius.backend = {
      enable = mkEnableOption "Campusmedius Backend";
      
      stateDir = mkOption {
        type = types.path;
        default = "/var/run/campusmedius/backend";
        description = "
          Directory holding all state for campusmedius backend.
        ";
      };
      
      dataDir = mkOption {
        type = types.path;
        default = "/var/data/campusmedius/db";
        description = "
          Directory holding the database for campusmedius backend.
        ";
      };
      
      mediaDir = mkOption {
        type = types.path;
        default = "/var/data/campusmedius/media";
        description = "
          Directory holding the media for campusmedius backend.
        ";
      };
      
      logDir = mkOption {
        type = types.path;
        default = "/var/log/campusmedius";
        description = "
          Directory holding logs for campusmedius backend.
        ";
      };
      
      mountPath = mkOption {
        type = types.path;
        default = "/api";
        description = "
          Mount path.
        ";
      };
      
      CORSAllowAll = mkOption {
        type = types.bool;
        default = false;
        description = "
          CORS allow all.
        ";
      };
      
      djangoAllowedHosts = mkOption {
        type = types.listOf types.str;
        default = [];
        description = "
          Django allowed hosts.
        ";
      };
    };
  };

  config = mkIf cfg.enable {
    systemd.services.cmbackend-init =
    { 
        wantedBy = [ "multi-user.target" ];
        environment = env;
        preStart = ''
            if ! [ -d ${cfg.mediaDir} ]; then
                mkdir -p ${cfg.mediaDir}
                cp -r ${pkgs.cm-backend}/share/campusmedius/media/* ${cfg.mediaDir}/
                chown -R www-data:www-data ${cfg.mediaDir}
                find ${cfg.mediaDir} -type d -exec chmod 755 {} \;
                find ${cfg.mediaDir} -type f -exec chmod 644 {} \;
            fi
            if ! [ -e ${cfg.dataDir}/.db-created ]; then
                # copy initial database from cm-backend pkg
                mkdir -p ${cfg.dataDir}
                chown -R www-data:www-data ${cfg.dataDir}
                
                cp ${pkgs.cm-backend}/share/campusmedius/db/campusmedius.sqlite3 ${cfg.dataDir}/db.sqlite3
                chown www-data:www-data ${cfg.dataDir}/db.sqlite3
                chmod 640 ${cfg.dataDir}/db.sqlite3
                touch ${cfg.dataDir}/.db-created
            fi
        '';
        script = ''
                echo "migrate database" 
                ${pythonenv}/bin/python ${pkgs.cm-backend}/share/campusmedius/campusmedius/manage.py migrate
        '';
        serviceConfig = {
            PermissionsStartOnly = true;
            Type = "oneshot";
            RemainAfterExit = true;
            User = "www-data";
            Group = "www-data";
        };
    };
  
    systemd.services.cmbackend = {
      description = "Campusmedius Backend";
      wantedBy = [ "multi-user.target" "djangoSecret-key.service" ];
      requires = [ "cmbackend-init.service" ];
      after = [ "network.target" "djangoSecret-key.service" "cmbackend-init.service" ];
      preStart = ''
        mkdir -p ${cfg.stateDir}
        mkdir -p ${cfg.logDir}
        
        chown -R www-data:www-data ${cfg.stateDir}
        chown -R www-data:www-data ${cfg.logDir}
        
        export SECRET_KEY="$(cat /run/keys/djangoSecret)"
      '';
      postStop = ''
        rm -rf ${cfg.stateDir}
      '';
      environment = env;
      script = ''
          ${uwsgi}/bin/uwsgi --plugin python3 --chdir=${pkgs.cm-backend}/share/campusmedius/campusmedius --mount ${cfg.mountPath}=campusmedius.wsgi:application --manage-script-name --master --pidfile=${cfg.stateDir}/cm-backend.pid --http-socket 127.0.0.1:8000 --processes=4 --harakiri=20 --max-requests=5000 --vacuum --home=/path/to/virtual/env --daemonize=${cfg.logDir}/cm-backend.log
      '';
      serviceConfig = {
        Type = "forking";
        PIDFile = "${cfg.stateDir}/cm-backend.pid";
        PermissionsStartOnly = true;
        Restart = "always";
        RestartSec = "5s";
        User = "www-data";
        Group = "www-data";
      };
    };

    environment.systemPackages = [ pkgs.cm-backend ];

    users.extraUsers.www-data = {
      group = "www-data";
      isSystemUser = true;
    };

    users.groups = { "www-data" = { }; };
  };
}
