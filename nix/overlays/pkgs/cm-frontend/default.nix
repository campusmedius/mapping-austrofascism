{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-2.0.1";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "fe0bc3d5ccbac8a5eabf41c1f954b8cc1fd875a5";
      sha256 = "0f7pn3gl9n7dkazn9gj9a1x41wypjx2gfd10qsg8ql0nxsicnbl6";
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
