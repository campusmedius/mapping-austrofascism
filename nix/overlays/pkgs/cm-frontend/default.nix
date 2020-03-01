{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-2.0.2";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "72844ccfbd6746718c67afcdc5a57a878265748b";
      sha256 = "1v4ymp29mzxj938ixf1615ny24rfjs0y6mf8h13ad9rb33lfkm3f";
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
