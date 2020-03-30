with import <nixpkgs> {};

let
  backend = callPackage ./nix/default.nix { };
  pythonenv = backend.pythonenv;
  python = backend.python;
  pythonPackages = python37Packages;
  uwsgi-python = backend.uwsgi;
in
stdenv.mkDerivation rec {
  name = "env";

  # Customizable development requirements
  buildInputs = [
    emacs
    uwsgi-python
    (pythonenv.override (old: {
      extraLibs = old.extraLibs ++ [ uwsgi-python pythonPackages.flake8 pythonPackages.yapf ];
    }))
  ];

  # Customizable development shell setup with at last SSL certs set
  shellHook = ''
    export DEBUG=True
  '';
}
