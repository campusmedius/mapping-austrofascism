{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-2.0.1";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "00327fc03d85783b4705a64ae06e54665d6e7a3c";
      sha256 = "13iz3g6d0z3h17h88s3yn10hc8q2lkjxgr4fidd0kxf3c4c0jyyn";
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
