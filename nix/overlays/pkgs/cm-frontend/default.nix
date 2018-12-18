{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-0.0.5";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "dab55970c31dc339744d196052b2d5592e638c83";
      sha256 = "00gbmzjkqwc38mdxhxb31spv6s400j62966a127g0kaza14sy000";
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
