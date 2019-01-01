{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-0.0.9";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "17ea1f3b47b6be1bf3cba31eccf4b6f1a467ac02";
      sha256 = "0cgvhvbvm0c145a9ixrqzqm1qscqfzrx669vgyz98w5dwj9prl98";
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
