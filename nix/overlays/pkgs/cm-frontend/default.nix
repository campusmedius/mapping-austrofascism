{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-2.0.1";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "63d5ba7e54e5af262e8fc8e3bfb5351ce6d84c54";
      sha256 = "07a6rp5z59vnvqlrykds9yd32f9c2i05pnz3vfpvqk5v8sqg1pdr";
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
