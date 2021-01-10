{ pkgs ? (import <nixpkgs> {}).pkgs }:
with pkgs;
mkShell {
  buildInputs = [
    python3Packages.virtualenv # run virtualenv .
    python3Packages.pyqt5 # avoid installing via pip
    python3Packages.pyusb # fixes the pyusb 'No backend available' when installed directly via pip
    python38Packages.gdal
  ];
  shellHook = ''
    # fixes libstdc++ issues and libgl.so issues
    export LD_LIBRARY_PATH=${stdenv.cc.cc.lib}/lib/:/run/opengl-driver/lib/
    # fixes xcb issues 
    export QT_PLUGIN_PATH=${qt5.qtbase}/${qt5.qtbase.qtPluginPrefix}
    export PYTHONPATH=`pwd`/env/lib/python3.7/site-packages/:$PYTHONPATH
    export PATH=`pwd`/env/bin:$PATH
  '';
}
