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
      rev = "4edea8093fafddaa37905ee2cc8c0b62703abb8e";
      sha256 = "1w4f7hclf646kqvppafksbcqykn1vq7q2qlllp91zn1dv0zl79sf";
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
