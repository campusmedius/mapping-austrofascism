{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-0.0.2";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "d7046b2926c2216516149f8ebb9c2a77ac07dbe9";
      sha256 = "1iiqb1yn6sfvwr9kw9cq1c1mzb1bdm819528s3vkr89p6722254q";
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
