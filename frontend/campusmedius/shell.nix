with import (builtins.fetchTarball "https://github.com/NixOS/nixpkgs/archive/1c1f5649bb9c1b0d98637c8c365228f57126f361.tar.gz") {};


let
  node2nix = callPackage ./nix/shell/default.nix { };
in
node2nix.shell.override (old: {
      buildInputs = old.buildInputs ++ [ emacs ];
})
 
