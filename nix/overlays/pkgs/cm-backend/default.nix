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
  name = "cm-backend-2.0.0";
  
  pythonenv = pythonenv;
  python = python;
  uwsgi = uwsgi-python;
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "334c32c4eec77e8b9129391a0ada3c621097a10b";
      sha256 = "0257y2f6xdp18q9v3b6rfywy9nh7kjhh6z0jy4sn0l6i52gpd8c7";
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
