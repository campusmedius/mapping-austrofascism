{
  network.description = "development";

  campusmedius =
    { config, pkgs, ... }:
    {
        imports =
        [
            ../configuration.nix
        ];
        
        # use local packages
        nixpkgs.overlays =
        [
            (import ../../overlays/campusmedius-development-overlay.nix)
        ];
        
        # campusmedius backend
        services.campusmedius.backend = {
            CORSAllowAll = true;
            djangoAllowedHosts = ["*"];
        };

        # keys
        deployment.keys.basicAuth.text = builtins.readFile ./keys/basicAuth;
        deployment.keys.basicAuth.group = "keys";
        deployment.keys.basicAuth.permissions = "0640";
        deployment.keys.djangoSecret.text = builtins.readFile ./keys/djangoSecret;
        
        networking.hostName = "campusmedius";
    };
} 
