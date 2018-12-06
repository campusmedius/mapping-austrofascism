{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-0.0.3";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "09c5802bab222ef1b7671ad38025df217fbe4c9d";
      sha256 = "0pb6jf7hnj6ai8f8gdl7wdd320hiv6hp6y2l8gh6cdsbr11ywy9q";
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
