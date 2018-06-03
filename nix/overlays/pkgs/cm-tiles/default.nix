{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-tiles-0.0.1";
  
  src = ../../../../backend/tiles/tiles.tar.gz;
  sourceRoot = ".";
  
  installPhase = ''
    mkdir -p $out/share/campusmedius/tiles
    mv ./* $out/share/campusmedius/tiles/
  '';

  meta = {
    description = "Campusmedius Tiles";
  };
}
