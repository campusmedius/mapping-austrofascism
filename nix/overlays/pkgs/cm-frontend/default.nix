{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-0.0.8";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "8e3326dc9903dec79bdc53994953c6fcceb2c282";
      sha256 = "0nnnkbgfsr3i8kid24qkmdibaqbc4z2v45a18qqmhp96ww54iwrv";
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
