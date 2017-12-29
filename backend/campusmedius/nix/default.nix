{stdenv, uwsgi, python36, python36Packages}:

let
    uwsgi-python = uwsgi.override { plugins = [ "python3" ]; };
    python = python36;
    pythonenv = let
        pipy2nix = import ./requirements.nix { };
    in
        with pipy2nix.packages;
        python.buildEnv.override {
            extraLibs = [ Django djangorestframework djangorestframework-camel-case django-cors-headers django-extensions django-filter django-tinymce4-lite ];
        };
in

stdenv.mkDerivation {
  name = "cm-backend-0.0.1";
  
  pythonenv = pythonenv;
  python = python;
  uwsgi = uwsgi-python;
  
  src = ../../campusmedius;

  buildInputs = [ uwsgi-python pythonenv ];
  
  installPhase = ''
    ${pythonenv}/bin/python ./campusmedius/manage.py collectstatic
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
