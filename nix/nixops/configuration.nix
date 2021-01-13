{ config, pkgs, ... }:
{
    imports =
    [
        ../nixos/modules/services/backend.nix
        ../nixos/modules/services/backend-v2.nix
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
    services.campusmedius.backendv2.enable = true;
    
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
            locations."/api/v2" = {
                extraConfig = ''
                    uwsgi_pass unix:///var/run/campusmedius/backendv2/uwsgi.sock;

                    uwsgi_cache my_cache;
                    uwsgi_cache_bypass 0;
                    uwsgi_cache_use_stale error timeout updating http_500;
                    uwsgi_cache_valid 200 10m;
                    uwsgi_cache_key $scheme$host$request_uri;
                    uwsgi_ignore_headers Set-Cookie Cache-Control Vary;
                    
                    expires 10m;
                    
                    auth_basic campusmedius;
                    auth_basic_user_file /run/keys/basicAuth;
                '';
            };
            locations."/api" = {
                extraConfig = ''
                    uwsgi_pass unix:///var/run/campusmedius/backend/uwsgi.sock;

                    uwsgi_cache my_cache;
                    uwsgi_cache_bypass 0;
                    uwsgi_cache_use_stale error timeout updating http_500;
                    uwsgi_cache_valid 200 10m;
                    uwsgi_cache_key $scheme$host$request_uri;
                    uwsgi_ignore_headers Set-Cookie Cache-Control Vary;
                    
                    expires 10m;
                    
                    #auth_basic campusmedius;
                    #auth_basic_user_file /run/keys/basicAuth;
                '';
            };
            locations."/static/v2/" = {
                alias = "${pkgs.cm-backend-v2}/share/campusmedius/static/";
                extraConfig = ''
                    #auth_basic campusmedius;
                    #auth_basic_user_file /run/keys/basicAuth;                    
                    expires 10m;
                    etag off;
                '';
            };
            locations."/media/v2/" = {
                alias = "${config.services.campusmedius.backendv2.mediaDir}/";
                extraConfig = ''
                    #auth_basic campusmedius;
                    #auth_basic_user_file /run/keys/basicAuth;
                    expires 24h;
                    etag off;
                '';
            };
            locations."/static/" = {
                alias = "${pkgs.cm-backend}/share/campusmedius/static/";
                extraConfig = ''
                    #auth_basic campusmedius;
                    #auth_basic_user_file /run/keys/basicAuth;                    
                    expires 10m;
                    etag off;
                '';
            };
            locations."/media/" = {
                alias = "${config.services.campusmedius.backend.mediaDir}/";
                extraConfig = ''
                    #auth_basic campusmedius;
                    #auth_basic_user_file /run/keys/basicAuth;
                    expires 24h;
                    etag off;
                '';
            };
            locations."/tiles/" = {
                alias = "${pkgs.cm-tiles}/share/campusmedius/tiles/";
                extraConfig = ''
                    try_files $uri /tiles/empty.png;
                    #auth_basic campusmedius;
                    #auth_basic_user_file /run/keys/basicAuth;
                    expires 24h;
                    etag off;
                '';
            };
            locations."/osm-tiles/" = {
                alias = "${pkgs.cm-osm-tiles}/share/campusmedius/osm-tiles/";
                extraConfig = ''
                    try_files $uri /tiles/empty.png;
                    #auth_basic campusmedius;
                    #auth_basic_user_file /run/keys/basicAuth;
                    expires 24h;
                    etag off;
                '';
            };
            locations."/v2/"= {
                alias = "${pkgs.cm-frontend-v2}/share/campusmedius/viewer/";
                extraConfig = ''
                    index /v2/index.html;
                    try_files $uri $uri$args $uri$args/ $uri/ /v2/index.html;
                    auth_basic campusmedius;
                    auth_basic_user_file /run/keys/basicAuth;
                    expires -1;
                    add_header Pragma "no-cache";
                    add_header Cache-Control "no-store, no-cache, must-revalidate, post-check=0, pre-check=0";
                    etag off;
                '';
            };
            locations."/" = {
                alias = "${pkgs.cm-frontend}/share/campusmedius/viewer/";
                extraConfig = ''
                    try_files $uri $uri/ /index.html;
                    #auth_basic campusmedius;
                    #auth_basic_user_file /run/keys/basicAuth;
                    expires 10m;
                    etag off;
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
