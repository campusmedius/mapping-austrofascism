{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-tiles-0.0.1";
  
  src = ../../../../campusmedius/backend/tiles/tiles.tar.gz;
  sourceRoot = ".";
  
  installPhase = ''
    mkdir -p $out/share/campusmedius/tiles
    mv tiles.tar.gz $out/share/campusmedius/tiles
    cd $out/share/campusmedius/tiles
    tar xvzf tiles.tar.gz
  '';

  meta = {
    description = "Campusmedius Tiles";
  };
}
