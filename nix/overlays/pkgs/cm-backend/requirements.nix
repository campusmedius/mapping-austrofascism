# generated using pypi2nix tool (version: 2.0.4)
# See more at: https://github.com/nix-community/pypi2nix
#
# COMMAND:
#   pypi2nix -V python37 -r requirements.txt
#

{ pkgs ? import <nixpkgs> {},
  overrides ? ({ pkgs, python }: self: super: {})
}:

let

  inherit (pkgs) makeWrapper;
  inherit (pkgs.stdenv.lib) fix' extends inNixShell;

  pythonPackages =
  import "${toString pkgs.path}/pkgs/top-level/python-packages.nix" {
    inherit pkgs;
    inherit (pkgs) stdenv;
    python = pkgs.python37;
  };

  commonBuildInputs = [];
  commonDoCheck = false;

  withPackages = pkgs':
    let
      pkgs = builtins.removeAttrs pkgs' ["__unfix__"];
      interpreterWithPackages = selectPkgsFn: pythonPackages.buildPythonPackage {
        name = "python37-interpreter";
        buildInputs = [ makeWrapper ] ++ (selectPkgsFn pkgs);
        buildCommand = ''
          mkdir -p $out/bin
          ln -s ${pythonPackages.python.interpreter} \
              $out/bin/${pythonPackages.python.executable}
          for dep in ${builtins.concatStringsSep " "
              (selectPkgsFn pkgs)}; do
            if [ -d "$dep/bin" ]; then
              for prog in "$dep/bin/"*; do
                if [ -x "$prog" ] && [ -f "$prog" ]; then
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
          ln -s ${pythonPackages.python.executable} \
              python3
          popd
        '';
        passthru.interpreter = pythonPackages.python;
      };

      interpreter = interpreterWithPackages builtins.attrValues;
    in {
      __old = pythonPackages;
      inherit interpreter;
      inherit interpreterWithPackages;
      mkDerivation = args: pythonPackages.buildPythonPackage (args // {
        nativeBuildInputs = (args.nativeBuildInputs or []) ++ args.buildInputs;
      });
      packages = pkgs;
      overrideDerivation = drv: f:
        pythonPackages.buildPythonPackage (
          drv.drvAttrs // f drv.drvAttrs // { meta = drv.meta; }
        );
      withPackages = pkgs'':
        withPackages (pkgs // pkgs'');
    };

  python = withPackages {};

  generated = self: {
    "beautifulsoup4" = python.mkDerivation {
      name = "beautifulsoup4-4.9.3";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/6b/c3/d31704ae558dcca862e4ee8e8388f357af6c9d9acb0cad4ba0fbbd350d9a/beautifulsoup4-4.9.3.tar.gz";
        sha256 = "84729e322ad1d5b4d25f805bfa05b902dd96450f43842c4e99067d5e1369eb25";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [
        self."soupsieve"
      ];
      meta = with pkgs.stdenv.lib; {
        homepage = "http://www.crummy.com/software/BeautifulSoup/bs4/";
        license = licenses.mit;
        description = "Screen-scraping library";
      };
    };

    "django" = python.mkDerivation {
      name = "django-1.11.28";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/52/be/e4bfd6db49d6b94112668ef3dcfb027c8717729a8daebf5c9fd19a4c5115/Django-1.11.28.tar.gz";
        sha256 = "b33ce35f47f745fea6b5aa3cf3f4241069803a3712d423ac748bd673a39741eb";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [
        self."pytz"
      ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://www.djangoproject.com/";
        license = licenses.bsdOriginal;
        description = "A high-level Python Web framework that encourages rapid development and clean, pragmatic design.";
      };
    };

    "django-cors-headers" = python.mkDerivation {
      name = "django-cors-headers-2.1.0";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/42/c4/5a9c89f4d10f26b71a012848901ebb744530a4277e8fd224abdfb4490131/django-cors-headers-2.1.0.tar.gz";
        sha256 = "451bc37a514792c2b46c52362368f7985985933ecdbf1a85f82652579a5cbe01";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://github.com/ottoyiu/django-cors-headers";
        license = licenses.mit;
        description = "django-cors-headers is a Django application for handling the server headers required for Cross-Origin Resource Sharing (CORS).";
      };
    };

    "django-extensions" = python.mkDerivation {
      name = "django-extensions-1.9.8";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/96/cd/a5a2ac25012a7859e788461e04e50be7e128fe988a58281a56f833009b88/django-extensions-1.9.8.tar.gz";
        sha256 = "9f1c314cfd4b974f03c5589f46f33051aa1d6b5a38cfb7f8824f59e9337768ae";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
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
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/db/12/491d519f5bee93709083c726b020ff9f09b95f32de36ae9023fbc89a21e4/django-filter-1.1.0.tar.gz";
        sha256 = "ec0ef1ba23ef95b1620f5d481334413700fb33f45cd76d56a63f4b0b1d76976a";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://github.com/carltongibson/django-filter/tree/master";
        license = licenses.bsdOriginal;
        description = "Django-filter is a reusable Django application for allowing users to filter querysets dynamically.";
      };
    };

    "django-location-field" = python.mkDerivation {
      name = "django-location-field-2.0.6";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/33/2d/89ef04d6fad2374e096c97208483b59c8941ed8c00a2214ee43b1fb2ec48/django-location-field-2.0.6.tar.gz";
        sha256 = "9d5be5270f23fd9949687ea7014838aba9e939127c9f2da082ffe112d34a43c8";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [
        self."django"
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
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/fb/8b/25f28d38a3dd2b508e915a3243b5ec2d8260927d12d4281703fd493761d8/django-softhyphen-1.1.0.tar.gz";
        sha256 = "2a9a8bb448fa832fd9dec0e58b12bbb070c6ec15972d46cd9324f19550d33821";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [
        self."beautifulsoup4"
        self."six"
      ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://github.com/datadesk/django-softhyphen/";
        license = "UNKNOWN";
        description = "A Python library for hyphenating HTML in your Django project";
      };
    };

    "django-taggit" = python.mkDerivation {
      name = "django-taggit-1.2.0";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/8d/6c/8b7a11936c42839fcee5bc517e719ff122b3c1c4a04956725087efe260fa/django-taggit-1.2.0.tar.gz";
        sha256 = "4186a6ce1e1e9af5e2db8dd3479c5d31fa11a87d216a2ce5089ba3afde24a2c5";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [
        self."django"
      ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://github.com/jazzband/django-taggit";
        license = licenses.bsdOriginal;
        description = "django-taggit is a reusable Django application for simple tagging.";
      };
    };

    "django-taggit-autosuggest" = python.mkDerivation {
      name = "django-taggit-autosuggest-0.3.8";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/09/69/cdf32da0d42453c013169f43a898c9ffeb03eb0221f4a78d1fc23eaf75a7/django-taggit-autosuggest-0.3.8.tar.gz";
        sha256 = "38a12cab02ad376394d9de8ceefecb4edb07df8b8926a6893dc89bc6871502db";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [
        self."django-taggit"
      ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://bitbucket.org/fabian/django-taggit-autosuggest";
        license = licenses.mit;
        description = "Autosuggestions for django-taggit";
      };
    };

    "django-taggit-serializer" = python.mkDerivation {
      name = "django-taggit-serializer-0.1.7";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/68/c4/9737e1df18ca8af0f40f46a54af08a15d75eb7afd7805ba94c87fc042ae3/django-taggit-serializer-0.1.7.tar.gz";
        sha256 = "f712eb2482079be452bcd1e82b18a820e26427c3ee1cef2b4fcd4d6b8b9f14d0";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [
        self."django-taggit"
        self."six"
      ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://github.com/glemmaPaul/django-taggit-serializer";
        license = licenses.bsdOriginal;
        description = "The Django Taggit serializer for tDjango REST Framework";
      };
    };

    "django-tinymce4-lite" = python.mkDerivation {
      name = "django-tinymce4-lite-1.6.0";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/c9/76/189c3638b97334be3a17be9d5a37a5112e4f1950343b476f06b92a0c8aa3/django-tinymce4-lite-1.6.0.tar.gz";
        sha256 = "b40e2e6b02c07279ce6d901a98dfe78e18eb227a284ff7bf70977a187fc04f71";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [
        self."django"
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
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/d5/e5/af122289560e14760cbb6d8dafb0a85e04d912944be3262d1a04984c4d42/djangorestframework-3.7.3.tar.gz";
        sha256 = "067960e5e9e5586d3b2d53a1d626c4800dc33cd8309487d404fc63355674556f";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "http://www.django-rest-framework.org";
        license = licenses.bsdOriginal;
        description = "Web APIs for Django, made easy.";
      };
    };

    "djangorestframework-camel-case" = python.mkDerivation {
      name = "djangorestframework-camel-case-0.2.0";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/06/e0/e7b0d8371d20b8d0b6ef7490951b8bb9a392fdf250c35d596ae6842a3db4/djangorestframework-camel-case-0.2.0.tar.gz";
        sha256 = "989c5c2d0324069fc1ecea4a5cb8913749d5f2f3c507b38977913ff1b76a719e";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://github.com/vbabiy/djangorestframework_camel_case";
        license = licenses.bsdOriginal;
        description = "Camel case JSON support for Django REST framework.";
      };
    };

    "geographiclib" = python.mkDerivation {
      name = "geographiclib-1.50";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/a5/b3/bac57fe2db304dc7e64e7d1597848b28b76ba5c2527c3076df091c9391f8/geographiclib-1.50.tar.gz";
        sha256 = "12bd46ee7ec25b291ea139b17aa991e7ef373e21abd053949b75c0e9ca55c632";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://geographiclib.sourceforge.io/1.50/python";
        license = licenses.mit;
        description = "The geodesic routines from GeographicLib";
      };
    };

    "geopy" = python.mkDerivation {
      name = "geopy-2.0.0";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/f3/c0/fd2ee60dee697708fd4af26ff9b8105a9b9cbf6fa42e3724ca1a28388b2b/geopy-2.0.0.tar.gz";
        sha256 = "b88e189f0d2e0051da45b6311d5b2ced59afaf1378eb27ebb57eaf37c166a03b";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [
        self."geographiclib"
      ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://github.com/geopy/geopy";
        license = licenses.mit;
        description = "Python Geocoding Toolbox";
      };
    };

    "jsmin" = python.mkDerivation {
      name = "jsmin-2.2.2";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/17/73/615d1267a82ed26cd7c124108c3c61169d8e40c36d393883eaee3a561852/jsmin-2.2.2.tar.gz";
        sha256 = "b6df99b2cd1c75d9d342e4335b535789b8da9107ec748212706ef7bbe5c2553b";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://github.com/tikitu/jsmin/";
        license = licenses.mit;
        description = "JavaScript minifier.";
      };
    };

    "pillow" = python.mkDerivation {
      name = "pillow-2.1.0";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/3a/e5/818487cf35069d1da6d78d87cada08ddedb3deb665094b95a49af16ba917/Pillow-2.1.0.zip";
        sha256 = "c733088b9a6f856386d3fcff8c54b3c1bc623a69f7481348fe36320513d98076";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "http://python-imaging.github.io/";
        license = "Standard PIL License";
        description = "Python Imaging Library (fork)";
      };
    };

    "pytz" = python.mkDerivation {
      name = "pytz-2020.4";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/09/07/448a8887c7195450604dfc0305d80d74324c36ee18ed997664051d4bffe3/pytz-2020.4.tar.gz";
        sha256 = "3e6b7dd2d1e0a59084bcee14a17af60c5c562cdc16d828e8eba2e683d3a7e268";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "http://pythonhosted.org/pytz";
        license = licenses.mit;
        description = "World timezone definitions, modern and historical";
      };
    };

    "six" = python.mkDerivation {
      name = "six-1.15.0";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/6b/34/415834bfdafca3c5f451532e8a8d9ba89a21c9743a0c59fbd0205c7f9426/six-1.15.0.tar.gz";
        sha256 = "30639c035cdb23534cd4aa2dd52c3bf48f06e5f4a941509c8bafd8ce11080259";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://github.com/benjaminp/six";
        license = licenses.mit;
        description = "Python 2 and 3 compatibility utilities";
      };
    };

    "soupsieve" = python.mkDerivation {
      name = "soupsieve-2.1";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/58/5d/445e21e92345848305eecf473338e9ec7ed8905b99ea78415042060127fc/soupsieve-2.1.tar.gz";
        sha256 = "6dc52924dc0bc710a5d16794e6b3480b2c7c08b07729505feab2b2c16661ff6e";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://github.com/facelessuser/soupsieve";
        license = licenses.mit;
        description = "A modern CSS selector implementation for Beautiful Soup.";
      };
    };

    "typing" = python.mkDerivation {
      name = "typing-3.7.4.3";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/05/d9/6eebe19d46bd05360c9a9aae822e67a80f9242aabbfc58b641b957546607/typing-3.7.4.3.tar.gz";
        sha256 = "1187fb9c82fd670d10aa07bbb6cfcfe4bdda42d6fab8d5134f04e8c4d0b71cc9";
};
      doCheck = commonDoCheck;
      format = "setuptools";
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://docs.python.org/3/library/typing.html";
        license = licenses.psfl;
        description = "Type Hints for Python";
      };
    };
  };
  localOverridesFile = ./requirements_override.nix;
  localOverrides = import localOverridesFile { inherit pkgs python; };
  commonOverrides = [
        (let src = pkgs.fetchFromGitHub { owner = "nix-community"; repo = "pypi2nix-overrides"; rev = "90e891e83ffd9e55917c48d24624454620d112f0"; sha256 = "0cl1r3sxibgn1ks9xyf5n3rdawq4hlcw4n6xfhg3s1kknz54jp9y"; } ; in import "${src}/overrides.nix" { inherit pkgs python; })
  ];
  paramOverrides = [
    (overrides { inherit pkgs python; })
  ];
  allOverrides =
    (if (builtins.pathExists localOverridesFile)
     then [localOverrides] else [] ) ++ commonOverrides ++ paramOverrides;

in python.withPackages
   (fix' (pkgs.lib.fold
            extends
            generated
            allOverrides
         )
   )