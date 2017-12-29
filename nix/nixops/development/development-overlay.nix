self: super:
{
  cm-backend = super.callPackage ../../../backend/campusmedius/nix { };
  cm-frontend = super.callPackage ../../../frontend/campusmedius/nix { };
} 
