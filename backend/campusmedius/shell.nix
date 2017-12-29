with import <nixpkgs> {};

let
  backend = callPackage ./nix/default.nix { };
  pythonenv = backend.pythonenv;
  python = backend.python;
  pythonPackages = backend.pythonPackages;
  uwsgi-python = backend.uwsgi;
in

(pythonenv.override (old: {
      extraLibs = old.extraLibs ++ [ uwsgi-python python36Packages.flake8 python36Packages.yapf emacs ];
})).env
