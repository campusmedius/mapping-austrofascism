{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-2.0.0";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "f7279bfdb7ec219dacf6db14df3a73b04a86cf84";
      sha256 = "189ln0lph8i33yhns3h01pj9v89j1wm9mzj67bm1vg026ynsr2h1";
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
