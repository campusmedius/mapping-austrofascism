{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-0.0.1";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "00065c076c2efac735959262d7d01bc85208cfe2";
      sha256 = "0yjdki03i5rpc09k0gs726j9fw0a5zj8c1bsgsxwy9ihxpdypvzy";
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
