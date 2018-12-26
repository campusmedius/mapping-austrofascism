{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-0.0.6";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "ff4a44b6d828fbf8ba3417889be08b5048a075b9";
      sha256 = "1hha5i18x6hg09gi3b027vr52973in2861hz21k78aaxmb27p1mi";
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
