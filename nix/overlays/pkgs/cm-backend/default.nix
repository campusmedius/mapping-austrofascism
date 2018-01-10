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
      rev = "24ed350ac1977cbebb21401d8b1e1bf6f2eaeb2d";
      sha256 = "0gjdmms7mf3bvcgphmgc9nynwiryvpal0jdmhrcd7ngi3a2f8vgn";
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
