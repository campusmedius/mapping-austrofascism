{stdenv, fetchgit}:

let
  version = (builtins.fromJSON (builtins.readFile ./v1.json));
in
  
  stdenv.mkDerivation {
  name = "cm-frontend-${version.version}";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = version.rev;
      sha256 = version.sha256;
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