self: super:
{
  cm-backend = super.callPackage ./pkgs/cm-backend/v1.nix { };
  cm-backend-v2 = super.callPackage ./pkgs/cm-backend { };
  cm-frontend = super.callPackage ./pkgs/cm-frontend/v1.nix { };
  cm-frontend-v2 = super.callPackage ./pkgs/cm-frontend { };
  cm-tiles = super.callPackage ./pkgs/cm-tiles { };
}
