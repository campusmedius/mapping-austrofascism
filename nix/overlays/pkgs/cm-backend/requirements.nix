# generated using pypi2nix tool (version: 1.8.1)
# See more at: https://github.com/garbas/pypi2nix
#
# COMMAND:
#   pypi2nix -V 3.6 -r requirements.txt
#

{ pkgs ? import <nixpkgs> {}
}:

let

  inherit (pkgs) makeWrapper;
  inherit (pkgs.stdenv.lib) fix' extends inNixShell;

  pythonPackages =
  import "${toString pkgs.path}/pkgs/top-level/python-packages.nix" {
    inherit pkgs;
    inherit (pkgs) stdenv;
    python = pkgs.python36;
    # patching pip so it does not try to remove files when running nix-shell
    overrides =
      self: super: {
        bootstrapped-pip = super.bootstrapped-pip.overrideDerivation (old: {
          patchPhase = old.patchPhase + ''
            sed -i               -e "s|paths_to_remove.remove(auto_confirm)|#paths_to_remove.remove(auto_confirm)|"                -e "s|self.uninstalled = paths_to_remove|#self.uninstalled = paths_to_remove|"                  $out/${pkgs.python35.sitePackages}/pip/req/req_install.py
          '';
        });
      };
  };

  commonBuildInputs = [];
  commonDoCheck = false;

  withPackages = pkgs':
    let
      pkgs = builtins.removeAttrs pkgs' ["__unfix__"];
      interpreter = pythonPackages.buildPythonPackage {
        name = "python36-interpreter";
        buildInputs = [ makeWrapper ] ++ (builtins.attrValues pkgs);
        buildCommand = ''
          mkdir -p $out/bin
          ln -s ${pythonPackages.python.interpreter}               $out/bin/${pythonPackages.python.executable}
          for dep in ${builtins.concatStringsSep " "               (builtins.attrValues pkgs)}; do
            if [ -d "$dep/bin" ]; then
              for prog in "$dep/bin/"*; do
                if [ -f $prog ]; then
                  ln -s $prog $out/bin/`basename $prog`
                fi
              done
            fi
          done
          for prog in "$out/bin/"*; do
            wrapProgram "$prog" --prefix PYTHONPATH : "$PYTHONPATH"
          done
          pushd $out/bin
          ln -s ${pythonPackages.python.executable} python
          ln -s ${pythonPackages.python.executable}               python3
          popd
        '';
        passthru.interpreter = pythonPackages.python;
      };
    in {
      __old = pythonPackages;
      inherit interpreter;
      mkDerivation = pythonPackages.buildPythonPackage;
      packages = pkgs;
      overrideDerivation = drv: f:
        pythonPackages.buildPythonPackage (drv.drvAttrs // f drv.drvAttrs //                                            { meta = drv.meta; });
      withPackages = pkgs'':
        withPackages (pkgs // pkgs'');
    };

  python = withPackages {};

  generated = self: {

    "Django" = python.mkDerivation {
      name = "Django-1.11.16";
      src = pkgs.fetchurl { url = "https://files.pythonhosted.org/packages/35/1d/59836bce4c9cfded261e21c0abd6a4629de6d289522d0fd928117d8eb985/Django-1.11.16.tar.gz"; sha256 = "29268cc47816a44f27308e60f71da635f549c47d8a1d003b28de55141df75791"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [
      self."pytz"
    ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://www.djangoproject.com/";
        license = licenses.bsdOriginal;
        description = "A high-level Python Web framework that encourages rapid development and clean, pragmatic design.";
      };
    };



    "Pillow" = python.mkDerivation {
      name = "Pillow-2.1.0";
      src = pkgs.fetchurl { url = "https://files.pythonhosted.org/packages/3a/e5/818487cf35069d1da6d78d87cada08ddedb3deb665094b95a49af16ba917/Pillow-2.1.0.zip"; sha256 = "c733088b9a6f856386d3fcff8c54b3c1bc623a69f7481348fe36320513d98076"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "http://python-imaging.github.io/";
        license = "Standard PIL License";
        description = "Python Imaging Library (fork)";
      };
    };



    "beautifulsoup4" = python.mkDerivation {
      name = "beautifulsoup4-4.6.3";
      src = pkgs.fetchurl { url = "https://files.pythonhosted.org/packages/88/df/86bffad6309f74f3ff85ea69344a078fc30003270c8df6894fca7a3c72ff/beautifulsoup4-4.6.3.tar.gz"; sha256 = "90f8e61121d6ae58362ce3bed8cd997efb00c914eae0ff3d363c32f9a9822d10"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "http://www.crummy.com/software/BeautifulSoup/bs4/";
        license = licenses.mit;
        description = "Screen-scraping library";
      };
    };



    "django-cors-headers" = python.mkDerivation {
      name = "django-cors-headers-2.1.0";
      src = pkgs.fetchurl { url = "https://files.pythonhosted.org/packages/42/c4/5a9c89f4d10f26b71a012848901ebb744530a4277e8fd224abdfb4490131/django-cors-headers-2.1.0.tar.gz"; sha256 = "451bc37a514792c2b46c52362368f7985985933ecdbf1a85f82652579a5cbe01"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://github.com/ottoyiu/django-cors-headers";
        license = licenses.mit;
        description = "django-cors-headers is a Django application for handling the server headers required for Cross-Origin Resource Sharing (CORS).";
      };
    };



    "django-extensions" = python.mkDerivation {
      name = "django-extensions-1.9.8";
      src = pkgs.fetchurl { url = "https://files.pythonhosted.org/packages/96/cd/a5a2ac25012a7859e788461e04e50be7e128fe988a58281a56f833009b88/django-extensions-1.9.8.tar.gz"; sha256 = "9f1c314cfd4b974f03c5589f46f33051aa1d6b5a38cfb7f8824f59e9337768ae"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [
      self."six"
      self."typing"
    ];
      meta = with pkgs.stdenv.lib; {
        homepage = "http://github.com/django-extensions/django-extensions";
        license = licenses.mit;
        description = "Extensions for Django";
      };
    };



    "django-filter" = python.mkDerivation {
      name = "django-filter-1.1.0";
      src = pkgs.fetchurl { url = "https://files.pythonhosted.org/packages/db/12/491d519f5bee93709083c726b020ff9f09b95f32de36ae9023fbc89a21e4/django-filter-1.1.0.tar.gz"; sha256 = "ec0ef1ba23ef95b1620f5d481334413700fb33f45cd76d56a63f4b0b1d76976a"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://github.com/carltongibson/django-filter/tree/master";
        license = licenses.bsdOriginal;
        description = "Django-filter is a reusable Django application for allowing users to filter querysets dynamically.";
      };
    };



    "django-location-field" = python.mkDerivation {
      name = "django-location-field-2.0.6";
      src = pkgs.fetchurl { url = "https://files.pythonhosted.org/packages/33/2d/89ef04d6fad2374e096c97208483b59c8941ed8c00a2214ee43b1fb2ec48/django-location-field-2.0.6.tar.gz"; sha256 = "9d5be5270f23fd9949687ea7014838aba9e939127c9f2da082ffe112d34a43c8"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [
      self."Django"
      self."six"
    ];
      meta = with pkgs.stdenv.lib; {
        homepage = "http://github.com/caioariede/django-location-field";
        license = licenses.mit;
        description = "Location field for Django";
      };
    };



    "django-softhyphen" = python.mkDerivation {
      name = "django-softhyphen-1.1.0";
      src = pkgs.fetchurl { url = "https://files.pythonhosted.org/packages/fb/8b/25f28d38a3dd2b508e915a3243b5ec2d8260927d12d4281703fd493761d8/django-softhyphen-1.1.0.tar.gz"; sha256 = "2a9a8bb448fa832fd9dec0e58b12bbb070c6ec15972d46cd9324f19550d33821"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [
      self."beautifulsoup4"
      self."six"
    ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://github.com/datadesk/django-softhyphen/";
        license = "";
        description = "A Python library for hyphenating HTML in your Django project";
      };
    };



    "django-tinymce4-lite" = python.mkDerivation {
      name = "django-tinymce4-lite-1.6.0";
      src = pkgs.fetchurl { url = "https://files.pythonhosted.org/packages/c9/76/189c3638b97334be3a17be9d5a37a5112e4f1950343b476f06b92a0c8aa3/django-tinymce4-lite-1.6.0.tar.gz"; sha256 = "b40e2e6b02c07279ce6d901a98dfe78e18eb227a284ff7bf70977a187fc04f71"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [
      self."Django"
      self."jsmin"
    ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://github.com/romanvm/django-tinymce4-lite";
        license = licenses.mit;
        description = "A Django application that provides a fully functional TinyMCE 4 editor widget for models and forms.";
      };
    };



    "djangorestframework" = python.mkDerivation {
      name = "djangorestframework-3.7.3";
      src = pkgs.fetchurl { url = "https://files.pythonhosted.org/packages/d5/e5/af122289560e14760cbb6d8dafb0a85e04d912944be3262d1a04984c4d42/djangorestframework-3.7.3.tar.gz"; sha256 = "067960e5e9e5586d3b2d53a1d626c4800dc33cd8309487d404fc63355674556f"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "http://www.django-rest-framework.org";
        license = licenses.bsdOriginal;
        description = "Web APIs for Django, made easy.";
      };
    };



    "djangorestframework-camel-case" = python.mkDerivation {
      name = "djangorestframework-camel-case-0.2.0";
      src = pkgs.fetchurl { url = "https://files.pythonhosted.org/packages/06/e0/e7b0d8371d20b8d0b6ef7490951b8bb9a392fdf250c35d596ae6842a3db4/djangorestframework-camel-case-0.2.0.tar.gz"; sha256 = "989c5c2d0324069fc1ecea4a5cb8913749d5f2f3c507b38977913ff1b76a719e"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://github.com/vbabiy/djangorestframework_camel_case";
        license = licenses.bsdOriginal;
        description = "Camel case JSON support for Django REST framework.";
      };
    };



    "jsmin" = python.mkDerivation {
      name = "jsmin-2.2.2";
      src = pkgs.fetchurl { url = "https://files.pythonhosted.org/packages/17/73/615d1267a82ed26cd7c124108c3c61169d8e40c36d393883eaee3a561852/jsmin-2.2.2.tar.gz"; sha256 = "b6df99b2cd1c75d9d342e4335b535789b8da9107ec748212706ef7bbe5c2553b"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://github.com/tikitu/jsmin/";
        license = licenses.mit;
        description = "JavaScript minifier.";
      };
    };



    "pytz" = python.mkDerivation {
      name = "pytz-2018.7";
      src = pkgs.fetchurl { url = "https://files.pythonhosted.org/packages/cd/71/ae99fc3df1b1c5267d37ef2c51b7d79c44ba8a5e37b48e3ca93b4d74d98b/pytz-2018.7.tar.gz"; sha256 = "31cb35c89bd7d333cd32c5f278fca91b523b0834369e757f4c5641ea252236ca"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "http://pythonhosted.org/pytz";
        license = licenses.mit;
        description = "World timezone definitions, modern and historical";
      };
    };



    "six" = python.mkDerivation {
      name = "six-1.12.0";
      src = pkgs.fetchurl { url = "https://files.pythonhosted.org/packages/dd/bf/4138e7bfb757de47d1f4b6994648ec67a51efe58fa907c1e11e350cddfca/six-1.12.0.tar.gz"; sha256 = "d16a0141ec1a18405cd4ce8b4613101da75da0e9a7aec5bdd4fa804d0e0eba73"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://github.com/benjaminp/six";
        license = licenses.mit;
        description = "Python 2 and 3 compatibility utilities";
      };
    };



    "typing" = python.mkDerivation {
      name = "typing-3.6.6";
      src = pkgs.fetchurl { url = "https://files.pythonhosted.org/packages/bf/9b/2bf84e841575b633d8d91ad923e198a415e3901f228715524689495b4317/typing-3.6.6.tar.gz"; sha256 = "4027c5f6127a6267a435201981ba156de91ad0d1d98e9ddc2aa173453453492d"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://docs.python.org/3/library/typing.html";
        license = licenses.psfl;
        description = "Type Hints for Python";
      };
    };

  };
  localOverridesFile = ./requirements_override.nix;
  overrides = import localOverridesFile { inherit pkgs python; };
  commonOverrides = [

  ];
  allOverrides =
    (if (builtins.pathExists localOverridesFile)
     then [overrides] else [] ) ++ commonOverrides;

in python.withPackages
   (fix' (pkgs.lib.fold
            extends
            generated
            allOverrides
         )
   )