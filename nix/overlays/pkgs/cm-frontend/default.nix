{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-0.0.7";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "2a15fb06270845c1a58547839134ee0b9b052284";
      sha256 = "0349xb0hby1ncx42kk32fppgw99iwj4l8215w74dp07b9bj3lz01";
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
