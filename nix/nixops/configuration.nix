{ config, pkgs, ... }:
{
    imports =
    [
        ../nixos/modules/services/backend.nix
    ];
    
    nixpkgs.overlays =
    [
        (import ../overlays/campusmedius-overlay.nix)
    ];

    # Select internationalisation properties.
    i18n = {
        consoleFont = "Lat2-Terminus16";
        consoleKeyMap = "de";
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
    
    # Enable the OpenSSH daemon.
    services.openssh.enable = true;

    # Open ports in the firewall.
    networking.firewall.allowedTCPPorts = [ 22 80 443 ];
    
    services.nginx = {
        enable = true;
        recommendedGzipSettings = true;
        recommendedOptimisation = true;
        recommendedProxySettings = true;
        recommendedTlsSettings = false;
        appendConfig = "worker_processes 2;";
        virtualHosts."campusmedius.net" = {
            locations."/api" = {
                extraConfig = ''
                    uwsgi_pass unix:///var/run/campusmedius/backend/uwsgi.sock;
                    auth_basic campusmedius;
                    auth_basic_user_file /run/keys/basicAuth;
                '';
            };
            locations."/static" = {
                alias = "${pkgs.cm-backend}/share/campusmedius/static";
                extraConfig = ''
                    auth_basic campusmedius;
                    auth_basic_user_file /run/keys/basicAuth;
                '';
            };
            locations."/tiles" = {
                alias = "${pkgs.cm-tiles}/share/campusmedius/tiles";
                extraConfig = ''
                    try_files $uri /tiles/1/1/1.png;
                    auth_basic campusmedius;
                    auth_basic_user_file /run/keys/basicAuth;
                '';
            };
            locations."/" = {
                alias = "${pkgs.cm-frontend}/share/campusmedius/viewer/";
                extraConfig = ''
                    try_files $uri $uri/ /index.html;
                    auth_basic campusmedius;
                    auth_basic_user_file /run/keys/basicAuth;
                '';
            };
            forceSSL = false;
            # sslCertificate = "/run/keys/sslCertificate";
            # sslCertificateKey = "/run/keys/sslCertificateKey";
        };
    };
    
    users.extraUsers.nginx.extraGroups = ["keys"];

    users.extraUsers.root.openssh.authorizedKeys.keys = ["ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCZM1p/W9r2LY0Klbl1eFhBgGK8Pd+X7XbLJdNwUbEp0KHcqQ0aLuC9+x2hjJJkRTXH8lsN5baWicqEAL+okHmYjkniOgCoreEVEDa8oLxE4o4kTetcfnQ8iCiSNyYIzexPfDKC8fDxt0MaFf2egctd1jaSr4tkUoxGb5VgqtjYNmRlBlZgdnh34FCMUlrgF/hiSNXbQCgKo8GlU83gwc8W2YsdRIos0rarz+aFyvIexphwFos2JXpBhJE6dJkqWsJXHem3i9a2uuSMM8xts+04i09Vm1wby3ww3kvR+rVcHGI/EtO/FSRU3dzIXRZmkEHAHAa6jjZsG4L2+uWZ3dD5 nd@nixos"];

    # This value determines the NixOS release with which your system is to be
    # compatible, in order to avoid breaking some software such as database
    # servers. You should change this only after NixOS release notes say you
    # should.
    system.stateVersion = "18.09"; # Did you read the comment?
}
