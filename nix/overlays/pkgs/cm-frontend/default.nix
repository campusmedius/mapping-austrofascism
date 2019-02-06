{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-2.0.1";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "cd8e58d4c9b8427ea771efcd3f017044849e3f04";
      sha256 = "1rbnmy67ha1xclr314yncgdyd1xn2iksvr4fpf1jprarccim3ckz";
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
