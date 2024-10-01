{stdenv}:

stdenv.mkDerivation {
  name = "cm-frontend-0.2.3";

  src = ../../campusmedius;
  
  installPhase = ''
    mkdir -p $out/share/campusmedius/viewer
    cp -R ./dist $out/share/campusmedius/viewer/dist
  '';

  meta = {
    description = "Campusmedius Frontend";
  };
}