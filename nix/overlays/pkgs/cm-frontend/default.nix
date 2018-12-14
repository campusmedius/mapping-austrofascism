{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-0.0.4";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "4dbd549914d8e316fab5699f4851617a617208a1";
      sha256 = "11r8kp8bbi2b06i0zfynif8pcrjn90x570sfh9fsvhj7wd6fidjj";
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
