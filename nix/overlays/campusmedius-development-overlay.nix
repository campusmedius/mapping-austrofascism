self: super:
{
  cm-backend = super.callPackage ../../backend/campusmedius/nix { };
  cm-tiles = super.callPackage ./pkgs/cm-tiles { };
  cm-frontend = super.callPackage ../../frontend/campusmedius/nix { };
}
