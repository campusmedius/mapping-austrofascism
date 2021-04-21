{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.campusmedius.frontend;  
  env = {};
in
with lib;
{
  options = {
    services.campusmedius.frontend = {
      enable = mkEnableOption "Campusmedius Frontend";
      
      stateDir = mkOption {
        type = types.path;
        default = "/var/run/campusmedius/frontend";
        description = "
          Directory holding all state for campusmedius backend.
        ";
      };
      
      logDir = mkOption {
        type = types.path;
        default = "/var/log/campusmedius";
        description = "
          Directory holding logs for campusmedius backend.
        ";
      };

    };
  };

  config = mkIf cfg.enable { 
    systemd.services.cmfrontend = {
      description = "Campusmedius Frontend";
      wantedBy = [ "multi-user.target" "djangoSecret-key.service" ];
      requires = [ ];
      after = [ "network.target" ];
      preStart = ''
        mkdir -p ${cfg.stateDir}
        mkdir -p ${cfg.logDir}
        chown -R www-data:www-data ${cfg.stateDir}
        chown -R www-data:www-data ${cfg.logDir}
      '';
      postStop = ''
        rm -rf ${cfg.stateDir}
      '';
      environment = env;
      script = ''
          ${pkgs.nodejs-14_x}/bin/node ./dist/campusmedius/server/main.js
      '';
      serviceConfig = {
        Type = "simple";
        PermissionsStartOnly = true;
        Restart = "always";
        RestartSec = "5s";
        User = "www-data";
        Group = "www-data";
        WorkingDirectory = "${pkgs.cm-frontend}/share/campusmedius/viewer";
      };
    };

    environment.systemPackages = [ pkgs.nodejs-14_x ];

    users.extraUsers.www-data = {
      group = "www-data";
    };

    users.groups = { "www-data" = { }; };
  };
}
