{stdenv, fetchgit, uwsgi, python36, python36Packages}:

let
    uwsgi-python = uwsgi.override { plugins = [ "python3" ]; };
    python = python36;
    pythonenv = let
        pipy2nix = import ./requirements.nix { };
    in
        python.buildEnv.override {
            extraLibs = builtins.attrValues pipy2nix.packages;
        };
in

stdenv.mkDerivation {
  name = "cm-backend-2.0.1";
  
  pythonenv = pythonenv;
  python = python;
  uwsgi = uwsgi-python;
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "f75d823ec8c52cb9e57626d5e02df7b67b708bc4";
      sha256 = "1ncprdn9x9kpqskv4x6pwvm71yhhk7b1c69zykws1p3vqkwjj76q";
  };

  buildInputs = [ uwsgi-python pythonenv ];
  
  installPhase = ''
    mkdir -p $out/share/campusmedius
    cd backend/campusmedius/campusmedius
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
