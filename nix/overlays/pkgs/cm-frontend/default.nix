{stdenv, fetchgit}:

let
  version = (builtins.fromJSON (builtins.readFile ./version.json));
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
    cd frontend/campusmediusv2
    cp -R ./dist $out/share/campusmedius/viewer/dist
  '';

  meta = {
    description = "Campusmedius Frontend";
  };
}