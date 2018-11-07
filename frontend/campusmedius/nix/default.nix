{stdenv}:

stdenv.mkDerivation {
  name = "cm-frontend-0.0.3";
  
  src = ../../campusmedius;
  
  installPhase = ''
    mkdir -p $out/share/campusmedius/viewer
    cp -R ./dist/* $out/share/campusmedius/viewer/
  '';

  meta = {
    description = "Campusmedius Frontend";
  };
}
