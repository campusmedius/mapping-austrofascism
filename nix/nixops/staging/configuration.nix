{
  network.description = "development";

  campusmedius =
    { config, pkgs, ... }:
    {
        imports =
        [
            ../configuration.nix
        ];
        
        networking.hostName = "campusmedius";
    };
} 
