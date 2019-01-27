{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-2.0.1";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "4edea8093fafddaa37905ee2cc8c0b62703abb8e";
      sha256 = "1w4f7hclf646kqvppafksbcqykn1vq7q2qlllp91zn1dv0zl79sf";
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
