{stdenv, uwsgi, python38, python38Packages }:
let
    uwsgi-python = uwsgi.override { plugins = [ "python3" ]; };
    python = python38;
    pythonenv = let
        pipy2nix = import ./requirements.nix { };
    in
        python.buildEnv.override {
            extraLibs = builtins.attrValues pipy2nix.packages;
        };
in
stdenv.mkDerivation {
  name = "cm-backend-dev";
  pythonenv = pythonenv;
  python = python;
  uwsgi = uwsgi-python;
  src = ../../campusmedius;
  buildInputs = [ uwsgi-python pythonenv ];
  installPhase = ''
    mkdir -p $out/share/campusmedius
    cd ./campusmedius
    ${pythonenv}/bin/python ./manage.py collectstatic --noinput
    cd ..
    cp -R ./* $out/share/campusmedius/
  '';
  shellHook = ''
     export PYTHONPATH=`python -c "import sys; print(':'.join(sys.path))"`
  '';
  meta = {
    description = "Campusmedius Backend";
  };
}
