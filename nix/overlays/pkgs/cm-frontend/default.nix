{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-0.0.1";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "6515a630353099a9d5d898be01b6d6e1ed518413";
      sha256 = "0a9alf8nnmr2w04av76dx8ad0j15xy3xd3brsix08dqr5fmvypy2";
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
