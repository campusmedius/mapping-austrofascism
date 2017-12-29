# generated using pypi2nix tool (version: 1.8.0)
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
        pythonPackages.buildPythonPackage (drv.drvAttrs // f drv.drvAttrs);
      withPackages = pkgs'':
        withPackages (pkgs // pkgs'');
    };

  python = withPackages {};

  generated = self: {

    "Django" = python.mkDerivation {
      name = "Django-1.11";
      src = pkgs.fetchurl { url = "https://pypi.python.org/packages/b0/9e/b1939fc389c091f17e725a7bd11a161db8fea8d632af708cba3b4e2deb94/Django-1.11.8.tar.gz"; sha256 = "04gphaarwj1yrhhpi9im6gsg77i2vv0iwyjc0pmxba53nndyglzy"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [
      self."pytz"
    ];
      meta = with pkgs.stdenv.lib; {
        homepage = "";
        license = licenses.bsdOriginal;
        description = "A high-level Python Web framework that encourages rapid development and clean, pragmatic design.";
      };
    };



    "django-cors-headers" = python.mkDerivation {
      name = "django-cors-headers-2.1.0";
      src = pkgs.fetchurl { url = "https://pypi.python.org/packages/42/c4/5a9c89f4d10f26b71a012848901ebb744530a4277e8fd224abdfb4490131/django-cors-headers-2.1.0.tar.gz"; sha256 = "451bc37a514792c2b46c52362368f7985985933ecdbf1a85f82652579a5cbe01"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "";
        license = licenses.mit;
        description = "django-cors-headers is a Django application for handling the server headers required for Cross-Origin Resource Sharing (CORS).";
      };
    };



    "django-extensions" = python.mkDerivation {
      name = "django-extensions-1.9.8";
      src = pkgs.fetchurl { url = "https://pypi.python.org/packages/96/cd/a5a2ac25012a7859e788461e04e50be7e128fe988a58281a56f833009b88/django-extensions-1.9.8.tar.gz"; sha256 = "9f1c314cfd4b974f03c5589f46f33051aa1d6b5a38cfb7f8824f59e9337768ae"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [
      self."six"
      self."typing"
    ];
      meta = with pkgs.stdenv.lib; {
        homepage = "";
        license = licenses.mit;
        description = "Extensions for Django";
      };
    };



    "django-filter" = python.mkDerivation {
      name = "django-filter-1.1.0";
      src = pkgs.fetchurl { url = "https://pypi.python.org/packages/db/12/491d519f5bee93709083c726b020ff9f09b95f32de36ae9023fbc89a21e4/django-filter-1.1.0.tar.gz"; sha256 = "ec0ef1ba23ef95b1620f5d481334413700fb33f45cd76d56a63f4b0b1d76976a"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "";
        license = licenses.bsdOriginal;
        description = "Django-filter is a reusable Django application for allowing users to filter querysets dynamically.";
      };
    };



    "django-tinymce4-lite" = python.mkDerivation {
      name = "django-tinymce4-lite-1.6.0";
      src = pkgs.fetchurl { url = "https://pypi.python.org/packages/c9/76/189c3638b97334be3a17be9d5a37a5112e4f1950343b476f06b92a0c8aa3/django-tinymce4-lite-1.6.0.tar.gz"; sha256 = "b40e2e6b02c07279ce6d901a98dfe78e18eb227a284ff7bf70977a187fc04f71"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [
      self."Django"
      self."jsmin"
    ];
      meta = with pkgs.stdenv.lib; {
        homepage = "";
        license = licenses.mit;
        description = "A Django application that provides a fully functional TinyMCE 4 editor widget for models and forms.";
      };
    };



    "djangorestframework" = python.mkDerivation {
      name = "djangorestframework-3.7.3";
      src = pkgs.fetchurl { url = "https://pypi.python.org/packages/d5/e5/af122289560e14760cbb6d8dafb0a85e04d912944be3262d1a04984c4d42/djangorestframework-3.7.3.tar.gz"; sha256 = "067960e5e9e5586d3b2d53a1d626c4800dc33cd8309487d404fc63355674556f"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "";
        license = licenses.bsdOriginal;
        description = "Web APIs for Django, made easy.";
      };
    };



    "djangorestframework-camel-case" = python.mkDerivation {
      name = "djangorestframework-camel-case-0.2.0";
      src = pkgs.fetchurl { url = "https://pypi.python.org/packages/06/e0/e7b0d8371d20b8d0b6ef7490951b8bb9a392fdf250c35d596ae6842a3db4/djangorestframework-camel-case-0.2.0.tar.gz"; sha256 = "989c5c2d0324069fc1ecea4a5cb8913749d5f2f3c507b38977913ff1b76a719e"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "";
        license = licenses.bsdOriginal;
        description = "Camel case JSON support for Django REST framework.";
      };
    };



    "jsmin" = python.mkDerivation {
      name = "jsmin-2.2.2";
      src = pkgs.fetchurl { url = "https://pypi.python.org/packages/17/73/615d1267a82ed26cd7c124108c3c61169d8e40c36d393883eaee3a561852/jsmin-2.2.2.tar.gz"; sha256 = "b6df99b2cd1c75d9d342e4335b535789b8da9107ec748212706ef7bbe5c2553b"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "";
        license = licenses.mit;
        description = "JavaScript minifier.";
      };
    };



    "pytz" = python.mkDerivation {
      name = "pytz-2017.3";
      src = pkgs.fetchurl { url = "https://pypi.python.org/packages/60/88/d3152c234da4b2a1f7a989f89609ea488225eaea015bc16fbde2b3fdfefa/pytz-2017.3.zip"; sha256 = "fae4cffc040921b8a2d60c6cf0b5d662c1190fe54d718271db4eb17d44a185b7"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "";
        license = licenses.mit;
        description = "World timezone definitions, modern and historical";
      };
    };



    "six" = python.mkDerivation {
      name = "six-1.11.0";
      src = pkgs.fetchurl { url = "https://pypi.python.org/packages/16/d8/bc6316cf98419719bd59c91742194c111b6f2e85abac88e496adefaf7afe/six-1.11.0.tar.gz"; sha256 = "70e8a77beed4562e7f14fe23a786b54f6296e34344c23bc42f07b15018ff98e9"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "";
        license = licenses.mit;
        description = "Python 2 and 3 compatibility utilities";
      };
    };



    "typing" = python.mkDerivation {
      name = "typing-3.6.2";
      src = pkgs.fetchurl { url = "https://pypi.python.org/packages/ca/38/16ba8d542e609997fdcd0214628421c971f8c395084085354b11ff4ac9c3/typing-3.6.2.tar.gz"; sha256 = "d514bd84b284dd3e844f0305ac07511f097e325171f6cc4a20878d11ad771849"; };
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs;
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "";
        license = licenses.psfl;
        description = "Type Hints for Python";
      };
    };

  };
  overrides = import ./requirements_override.nix { inherit pkgs python; };
  commonOverrides = [

  ];

in python.withPackages
   (fix' (pkgs.lib.fold
            extends
            generated
            ([overrides] ++ commonOverrides)
         )
   )
