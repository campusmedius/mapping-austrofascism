{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-2.0.3";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "f75d823ec8c52cb9e57626d5e02df7b67b708bc4";
      sha256 = "1ncprdn9x9kpqskv4x6pwvm71yhhk7b1c69zykws1p3vqkwjj76q";
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
