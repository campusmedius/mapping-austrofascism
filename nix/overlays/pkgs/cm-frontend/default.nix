{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-0.0.1";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "24ed350ac1977cbebb21401d8b1e1bf6f2eaeb2d";
      sha256 = "0gjdmms7mf3bvcgphmgc9nynwiryvpal0jdmhrcd7ngi3a2f8vgn";
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
