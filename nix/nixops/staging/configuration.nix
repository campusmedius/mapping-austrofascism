{
  network.description = "development";

  campusmedius =
    { config, pkgs, ... }:
    {
        imports =
        [
            ../configuration.nix
        ];
        
        services.campusmedius.backend = {
            CORSAllowAll = true;
            djangoAllowedHosts = ["campusmedius.net" "localhost" "192.168.56.101" "192.168.56.102" "192.168.56.103" "192.168.56.104" "192.168.56.105" "192.168.56.106" "192.168.56.107" "192.168.56.108" "192.168.56.109"];
        };
        
        # keys
        deployment.keys.basicAuth.text = builtins.readFile ./keys/basicAuth;
        deployment.keys.basicAuth.group = "keys";
        deployment.keys.basicAuth.permissions = "0640";
        deployment.keys.djangoSecret.text = builtins.readFile ./keys/djangoSecret;
        
        networking.hostName = "campusmedius";

        services.nginx = {
            virtualHosts."www.campusmedius.net" = {
                addSSL = false;
                enableACME = false;
            };
            virtualHosts."campusmedius.net" = {
                addSSL = false;
                enableACME = false;
            };
        }; 
    };
} 
