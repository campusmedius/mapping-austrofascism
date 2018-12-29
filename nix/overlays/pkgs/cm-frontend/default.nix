{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-0.0.8";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "f39d174a250902a04a951a76fae73cc9c6729f10";
      sha256 = "14x3jzhfghx6hi951myng4sd9jmr1j5q13prah1gg3ghylfvl5hp";
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
