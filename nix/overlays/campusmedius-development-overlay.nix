self: super:
{
  cm-backend = super.callPackage ../../backend/campusmedius/nix { };
  cm-tiles = super.callPackage ./pkgs/cm-tiles { };
  cm-osm-tiles = super.callPackage ./pkgs/cm-osm-tiles { };
  cm-frontend = super.callPackage ../../frontend/campusmedius/nix { };
}
