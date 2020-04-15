self: super:
{
  cm-backend = super.callPackage ./pkgs/cm-backend/v1.nix { };
  cm-backend-v2 = super.callPackage ../../backend/campusmedius/nix { };
  cm-tiles = super.callPackage ./pkgs/cm-tiles { };
  cm-frontend = super.callPackage ./pkgs/cm-frontend/v1.nix { };
  cm-frontend-v2 = super.callPackage ../../frontend/campusmediusv2/nix { };
}
