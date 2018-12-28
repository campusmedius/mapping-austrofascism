{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-0.0.8";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "4880ced5c8c4076eb01ddcdfdad830337ba2b27d";
      sha256 = "0g45jgp2mm522y07r522mk02nbwskqqd7v6na2k96n137arw43mf";
  };
  
  installPhase = ''
    mkdir -p $out/share/campusmedius/viewer
    cd frontend/campusmedius
    cp -R ./dist/* $out/share/campusmedius/viewer/
  '';

  meta = {
    description = "Campusmedius Frontend";
  };
}
