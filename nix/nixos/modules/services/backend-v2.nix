{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.campusmedius.backendv2;
  uwsgi = pkgs.cm-backend-v2.uwsgi;
  pythonenv = pkgs.cm-backend-v2.pythonenv;
  
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
    services.campusmedius.backendv2 = {
      enable = mkEnableOption "Campusmedius Backend";
      
      stateDir = mkOption {
        type = types.path;
        default = "/var/run/campusmedius/backendv2";
        description = "
          Directory holding all state for campusmedius backend.
        ";
      };
      
      dataDir = mkOption {
        type = types.path;
        default = "/var/data/campusmediusv2/db";
        description = "
          Directory holding the database for campusmedius backend.
        ";
      };
      
      mediaDir = mkOption {
        type = types.path;
        default = "/var/data/campusmediusv2/media";
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
        default = "/api/v2";
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
    systemd.services.cmbackendv2-init =
    { 
        wantedBy = [ "multi-user.target" ];
        environment = env;
        preStart = ''
            if ! [ -d ${cfg.mediaDir} ]; then
                mkdir -p ${cfg.mediaDir}
                cp -r ${pkgs.cm-backend-v2}/share/campusmedius/media/* ${cfg.mediaDir}/
                chown -R www-data:www-data ${cfg.mediaDir}
                find ${cfg.mediaDir} -type d -exec chmod 755 {} \;
                find ${cfg.mediaDir} -type f -exec chmod 644 {} \;
            fi
            if ! [ -e ${cfg.dataDir}/.db-created ]; then
                # copy initial database from cm-backend-v2 pkg
                mkdir -p ${cfg.dataDir}
                chown -R www-data:www-data ${cfg.dataDir}
                
                cp ${pkgs.cm-backend-v2}/share/campusmedius/db/campusmedius.sqlite3 ${cfg.dataDir}/db.sqlite3
                chown www-data:www-data ${cfg.dataDir}/db.sqlite3
                chmod 640 ${cfg.dataDir}/db.sqlite3
                touch ${cfg.dataDir}/.db-created
            fi
        '';
        script = ''
                echo "migrate database" 
                ${pythonenv}/bin/python ${pkgs.cm-backend-v2}/share/campusmedius/campusmedius/manage.py migrate
        '';
        serviceConfig = {
            PermissionsStartOnly = true;
            Type = "oneshot";
            RemainAfterExit = true;
            User = "www-data";
            Group = "www-data";
        };
    };
  
    systemd.services.cmbackendv2 = {
      description = "Campusmedius Backend";
      wantedBy = [ "multi-user.target" "djangoSecret-key.service" ];
      requires = [ "cmbackendv2-init.service" ];
      after = [ "network.target" "djangoSecret-key.service" "cmbackendv2-init.service" ];
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
          ${uwsgi}/bin/uwsgi --plugin python3 --chdir=${pkgs.cm-backend-v2}/share/campusmedius/campusmedius --mount ${cfg.mountPath}=campusmedius.wsgi:application --manage-script-name --master --pidfile=${cfg.stateDir}/cm-backend-v2.pid --http-socket 127.0.0.1:8000 --processes=4 --harakiri=20 --max-requests=5000 --vacuum --home=/path/to/virtual/env --daemonize=${cfg.logDir}/cm-backend-v2.log
      '';
      serviceConfig = {
        Type = "forking";
        PIDFile = "${cfg.stateDir}/cm-backend-v2.pid";
        PermissionsStartOnly = true;
        Restart = "always";
        RestartSec = "5s";
        User = "www-data";
        Group = "www-data";
      };
    };

    environment.systemPackages = [ pkgs.cm-backend-v2 ];

    users.extraUsers.www-data = {
      group = "www-data";
    };

    users.extraGroups = singleton{ name = "www-data";};
  };
}
