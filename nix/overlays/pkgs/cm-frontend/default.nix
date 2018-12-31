{stdenv, fetchgit}:

stdenv.mkDerivation {
  name = "cm-frontend-0.0.8";
  
  src = fetchgit {
      url = https://github.com/campusmedius/campusmedius.git;
      rev = "96c5b5717030c3cac10f93899839c2a5f788437c";
      sha256 = "07z0v0dxbwiwy8agyyizbjvvdnkk1h1i5ripqxmgnvxwjm17x9my";
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
