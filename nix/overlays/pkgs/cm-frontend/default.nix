{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-2.0.1";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "791cf7d7f62ef55a9b630b3a8f7aca6b616a4d67";
      sha256 = "1jj6kd0x7j2wrwi1ab14wpdyzfjpi9rl9wqqr0r62i1s9bpfar8k";
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
