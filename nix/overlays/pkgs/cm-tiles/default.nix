{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-tiles-0.0.5";
  
  src = ../../../../backend/tiles/tiles.tar.gz;
  sourceRoot = ".";
  
  phases = [ "unpackPhase" "installPhase"  ];
  
  installPhase = ''
    mkdir -p $out/share/campusmedius/tiles
    mv ./* $out/share/campusmedius/tiles/
  '';

  meta = {
    description = "Campusmedius Tiles";
  };
}
