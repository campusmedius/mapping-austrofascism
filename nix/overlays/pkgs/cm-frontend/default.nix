{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-0.0.2";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "d70ba348840389b7334a427073f11b69d4b22173";
      sha256 = "1a9hq31b91h39569sfrws21zdv4vi6nrlxj44apn6s6mkni84d9m";
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
