{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-2.0.1";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "466617469d32126896b689f6f68fba9f9b8116bc";
      sha256 = "1pps9018qkhj2bnp46n3v0g6jrvch0j0z1k9f47vll53hhvi19q6";
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
