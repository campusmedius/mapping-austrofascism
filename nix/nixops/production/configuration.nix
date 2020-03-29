{
  network.description = "production";

  campusmedius =
    { config, pkgs, ... }:
    {
        imports =
        [ # Include the results of the hardware scan.
            ./hardware-configuration.nix
            ../configuration.nix
        ];

        # Use the GRUB 2 boot loader.
        boot.loader.grub.enable = true;
        boot.loader.grub.version = 2;
        # Define on which hard drive you want to install Grub.
        boot.loader.grub.device = "/dev/sda"; # or "nodev" for efi only

        networking.hostName = "campusmedius"; # Define your hostname.
        networking.interfaces.ens192.ipv4.addresses = [ { address = "131.130.75.201"; prefixLength = 24; } ];
        networking.defaultGateway  = "131.130.75.1";
        networking.nameservers     = [ "8.8.8.8" "8.8.4.4" ];

        # List services that you want to enable:

        services.vmwareGuest.enable = true;
        services.vmwareGuest.headless = true;
        
        # cm backend
        services.campusmedius.backend = {
            CORSAllowAll = true;
            djangoAllowedHosts = ["campusmedius.net" "131.130.75.201"];
        };
        
        # keys
        deployment.keys.basicAuth.text = builtins.readFile ./keys/basicAuth;
        deployment.keys.basicAuth.group = "keys";
        deployment.keys.basicAuth.permissions = "0640";
        deployment.keys.djangoSecret.text = builtins.readFile ./keys/djangoSecret;

    };
} 
