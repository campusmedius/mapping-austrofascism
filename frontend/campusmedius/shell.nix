with import <nixpkgs> {};

let
  node2nix = callPackage ./nix/shell/default.nix { };
in
node2nix.shell
 
