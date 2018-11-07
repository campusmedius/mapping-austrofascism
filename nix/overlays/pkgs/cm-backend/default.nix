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
  name = "cm-backend-0.0.1";
  
  pythonenv = pythonenv;
  python = python;
  uwsgi = uwsgi-python;
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "6515a630353099a9d5d898be01b6d6e1ed518413";
      sha256 = "0a9alf8nnmr2w04av76dx8ad0j15xy3xd3brsix08dqr5fmvypy2";
  };

  buildInputs = [ uwsgi-python pythonenv ];
  
  installPhase = ''
    mkdir -p $out/share/campusmedius
    cd backend/campusmedius/campusmedius
    ${pythonenv}/bin/python ./manage.py collectstatic
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
