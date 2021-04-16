{ config, pkgs, ... }:
{
    imports =
    [
        ../nixos/modules/services/backend.nix
        ../nixos/modules/services/frontend.nix
    ];
    
    nixpkgs.overlays =
    [
        (import ../overlays/campusmedius-overlay.nix)
    ];

    # Select internationalisation properties.
    console.font = "Lat2-Terminus16";
    console.keyMap = "de";
    i18n = {
        defaultLocale = "en_US.UTF-8";
    };

    # Set your time zone.
    time.timeZone = "Europe/Vienna";

    # List packages installed in system profile. To search by name, run:
    # $ nix-env -qaP | grep wget
    environment.systemPackages = with pkgs; [
        vim
        htop
    ];
    
    programs.bash.enableCompletion = true;

    # campusmedius backend
    services.campusmedius.backend.enable = true;
    services.campusmedius.frontend.enable = true;
    
    # Enable the OpenSSH daemon.
    services.openssh.enable = true;

    # Open ports in the firewall.
    networking.firewall.allowedTCPPorts = [ 22 80 443 ];

    #security.acme.preliminarySelfsigned = true;
    security.acme.email = "campusmedius@gmail.com";
    security.acme.acceptTerms = true;
    
    services.nginx = {
        enable = true;
        recommendedGzipSettings = true;
        recommendedOptimisation = true;
        recommendedProxySettings = true;
        recommendedTlsSettings = false;
        appendConfig = "worker_processes 2;";
        virtualHosts."www.campusmedius.net" = {
            locations."/" = {
              extraConfig = ''
                return  301 https://campusmedius.net$request_uri;
              '';
            };
        };
        virtualHosts."campusmedius.net" = {
            locations."/api/" = {
                extraConfig = ''
                    proxy_pass http://127.0.0.1:8000;
                    proxy_set_header X-Real-IP $remote_addr;
                    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                    proxy_set_header Host $host;
                    proxy_http_version 1.1;
                    proxy_set_header X-NginX-Proxy true;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection "upgrade";
                    proxy_cache_bypass $http_upgrade;
                    proxy_redirect off;
                    proxy_set_header X-Forwarded-Proto $scheme;
                    
                    expires 10m;
                    
                    #auth_basic campusmedius;
                    #auth_basic_user_file /run/keys/basicAuth;
                '';
            };
            locations."/static/" = {
                alias = "${pkgs.cm-backend}/share/campusmedius/static/";
                extraConfig = ''                  
                    expires 24h;
                    etag off;
                '';
            };
            locations."/media/" = {
                alias = "${config.services.campusmedius.backend.mediaDir}/";
                extraConfig = ''
                    expires 24h;
                    etag off;
                '';
            };
            locations."/tiles/" = {
                alias = "${pkgs.cm-tiles}/share/campusmedius/tiles/";
                extraConfig = ''
                    try_files $uri /tiles/empty.png;
                    expires 24h;
                    etag off;
                '';
            };
            locations."/osm-tiles/" = {
                alias = "${pkgs.cm-osm-tiles}/share/campusmedius/osm-tiles/";
                extraConfig = ''
                    try_files $uri /tiles/empty.png;
                    expires 24h;
                    etag off;
                '';
            };
            locations."/sitemap.xml"= {
                extraConfig = ''
                    proxy_pass http://127.0.0.1:8000;
                    proxy_set_header X-Real-IP $remote_addr;
                    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                    proxy_set_header Host $host;
                    proxy_http_version 1.1;
                    proxy_set_header X-NginX-Proxy true;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection "upgrade";
                    proxy_cache_bypass $http_upgrade;
                    proxy_redirect off;
                    proxy_set_header X-Forwarded-Proto $scheme;
                    
                    expires 10m;
                '';
            };
            locations."/" = {
                alias = "${pkgs.cm-frontend}/share/campusmedius/viewer/dist/campusmedius/browser/";
                extraConfig = ''
                    try_files $uri $uri/ @ssr;
                    add_header Cache-Control "no-store, no-cache, must-revalidate";
                '';
                priority = 1001;
            };
            locations."@ssr"= {
                extraConfig = ''
                    rewrite  ^/(.*) /$1 break;
                    proxy_pass http://127.0.0.1:4000;
                    proxy_set_header X-Real-IP $remote_addr;
                    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                    proxy_set_header Host $host;
                    proxy_http_version 1.1;
                    proxy_set_header X-NginX-Proxy true;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection "upgrade";
                    proxy_cache_bypass $http_upgrade;
                    proxy_redirect off;
                    proxy_set_header X-Forwarded-Proto $scheme;

                    expires 10m;
                '';
            };
        };
        appendHttpConfig = ''
          uwsgi_cache_path /var/spool/nginx/cache levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=10m use_temp_path=off;
        '';
    };
    
    users.extraUsers.nginx.extraGroups = ["keys"];

    users.extraUsers.root.openssh.authorizedKeys.keys = ["ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCZM1p/W9r2LY0Klbl1eFhBgGK8Pd+X7XbLJdNwUbEp0KHcqQ0aLuC9+x2hjJJkRTXH8lsN5baWicqEAL+okHmYjkniOgCoreEVEDa8oLxE4o4kTetcfnQ8iCiSNyYIzexPfDKC8fDxt0MaFf2egctd1jaSr4tkUoxGb5VgqtjYNmRlBlZgdnh34FCMUlrgF/hiSNXbQCgKo8GlU83gwc8W2YsdRIos0rarz+aFyvIexphwFos2JXpBhJE6dJkqWsJXHem3i9a2uuSMM8xts+04i09Vm1wby3ww3kvR+rVcHGI/EtO/FSRU3dzIXRZmkEHAHAa6jjZsG4L2+uWZ3dD5 nd@nixos" "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIO/gK4eoqB+DtCL9kj3NJfRZV4xGW8tratfW8DIf2UhR akrim@zaanb20"];

    # This value determines the NixOS release with which your system is to be
    # compatible, in order to avoid breaking some software such as database
    # servers. You should change this only after NixOS release notes say you
    # should.
    system.stateVersion = "19.09"; # Did you read the comment?
}
