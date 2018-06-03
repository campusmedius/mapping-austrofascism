{stdenv}:

stdenv.mkDerivation {
  name = "cm-frontend-0.0.2";
  
  src = ../../campusmedius;
  
  installPhase = ''
    mkdir -p $out/share/campusmedius/viewer
    cp -R ./build/* $out/share/campusmedius/viewer/
  '';

  meta = {
    description = "Campusmedius Frontend";
  };
}
