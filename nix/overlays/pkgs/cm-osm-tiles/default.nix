{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-osm-tiles-0.0.1";
  
  src = ../../../../backend/osm-tiles/tiles.tar.gz;
  sourceRoot = ".";
  
  phases = [ "unpackPhase" "installPhase"  ];
  
  installPhase = ''
    mkdir -p $out/share/campusmedius/osm-tiles
    mv ./* $out/share/campusmedius/osm-tiles/
  '';

  meta = {
    description = "Campusmedius OSM Tiles";
  };
}
