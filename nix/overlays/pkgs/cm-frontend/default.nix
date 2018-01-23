{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-0.0.1";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "ce2b8333a7246259d38e65f28cdef2b8644707a8";
      sha256 = "1m15rssvhc1k7hy89ppq3nc7vsgss4frpkn7s12cb8vmcdm78b04";
  };
  
  installPhase = ''
    mkdir -p $out/share/campusmedius/viewer
    cd frontend/campusmedius
    cp -R ./build/* $out/share/campusmedius/viewer/
  '';

  meta = {
    description = "Campusmedius Frontend";
  };
}
