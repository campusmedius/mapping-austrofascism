{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-0.0.5";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "64229646c2bd031420a1822362a423fc271beded";
      sha256 = "1dd2ns938qcp5scdjr59ldjh81bpsr2gfyp4jfzqy033d6j3gc91";
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
