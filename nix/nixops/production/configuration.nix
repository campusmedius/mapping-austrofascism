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
        networking.interfaces.ens192 = { ipAddress = "131.130.75.201"; prefixLength = 24; };
        networking.defaultGateway  = "131.130.75.1";
        networking.nameservers     = [ "8.8.8.8" "8.8.4.4" ];

        # List services that you want to enable:

        services.vmwareGuest.enable = true;
        services.vmwareGuest.headless = true;

    };
} 
