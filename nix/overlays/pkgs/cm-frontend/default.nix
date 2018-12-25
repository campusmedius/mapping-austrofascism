{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-0.0.6";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "947ff2c56bc30098432b0b10ca780450542e08ac";
      sha256 = "1587hhiwa5ifbdn9qzq40pkpl1pdzsp10h9739nslddgkgg4m8p5";
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
