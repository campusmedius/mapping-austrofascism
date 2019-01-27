{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-2.0.1";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "597ba4c5d8cac571504c395ec224c805ddb8e63d";
      sha256 = "16xbk3a1m4227s8zl2nn05zmdpr9izkqvmyxh3l3d71l0zaax2dn";
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
