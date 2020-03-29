{stdenv, uwsgi, python37, python37Packages }:
let
    uwsgi-python = uwsgi.override { plugins = [ "python3" ]; };
    python = python37;
    pythonenv = let
        pipy2nix = import ./requirements.nix { };
    in
        python.buildEnv.override {
            extraLibs = builtins.attrValues pipy2nix.packages;
        };
in
stdenv.mkDerivation {
  name = "cm-backend-0.2.2";
  pythonenv = pythonenv;
  python = python;
  uwsgi = uwsgi-python;
  src = ../../campusmedius;
  buildInputs = [ uwsgi-python pythonenv ];
  installPhase = ''
    ${pythonenv}/bin/python ./campusmedius/manage.py collectstatic --noinput
    mkdir -p $out/share/campusmedius
    cp -R ./* $out/share/campusmedius/
  '';
  shellHook = ''
     export PYTHONPATH=`python -c "import sys; print(':'.join(sys.path))"`
  '';
  meta = {
    description = "Campusmedius Backend";
  };
}
