# generated using pypi2nix tool (version: 2.0.2.dev16+g0afc9c3)
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
      name = "beautifulsoup4-4.8.2";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/52/ba/0e121661f529e7f456e903bf5c4d255b8051d8ce2b5e629c5212efe4c3f1/beautifulsoup4-4.8.2.tar.gz";
        sha256 = "05fd825eb01c290877657a56df4c6e4c311b3965bda790c613a3d6fb01a5462a";
};
      doCheck = commonDoCheck;
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

    "django-tinymce4-lite" = python.mkDerivation {
      name = "django-tinymce4-lite-1.6.0";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/c9/76/189c3638b97334be3a17be9d5a37a5112e4f1950343b476f06b92a0c8aa3/django-tinymce4-lite-1.6.0.tar.gz";
        sha256 = "b40e2e6b02c07279ce6d901a98dfe78e18eb227a284ff7bf70977a187fc04f71";
};
      doCheck = commonDoCheck;
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
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://github.com/vbabiy/djangorestframework_camel_case";
        license = licenses.bsdOriginal;
        description = "Camel case JSON support for Django REST framework.";
      };
    };

    "jsmin" = python.mkDerivation {
      name = "jsmin-2.2.2";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/17/73/615d1267a82ed26cd7c124108c3c61169d8e40c36d393883eaee3a561852/jsmin-2.2.2.tar.gz";
        sha256 = "b6df99b2cd1c75d9d342e4335b535789b8da9107ec748212706ef7bbe5c2553b";
};
      doCheck = commonDoCheck;
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
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "http://python-imaging.github.io/";
        license = "Standard PIL License";
        description = "Python Imaging Library (fork)";
      };
    };

    "pytz" = python.mkDerivation {
      name = "pytz-2019.3";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/82/c3/534ddba230bd4fbbd3b7a3d35f3341d014cca213f369a9940925e7e5f691/pytz-2019.3.tar.gz";
        sha256 = "b02c06db6cf09c12dd25137e563b31700d3b80fcc4ad23abb7a315f2789819be";
};
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "http://pythonhosted.org/pytz";
        license = licenses.mit;
        description = "World timezone definitions, modern and historical";
      };
    };

    "six" = python.mkDerivation {
      name = "six-1.14.0";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/21/9f/b251f7f8a76dec1d6651be194dfba8fb8d7781d10ab3987190de8391d08e/six-1.14.0.tar.gz";
        sha256 = "236bdbdce46e6e6a3d61a337c0f8b763ca1e8717c03b369e87a7ec7ce1319c0a";
};
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://github.com/benjaminp/six";
        license = licenses.mit;
        description = "Python 2 and 3 compatibility utilities";
      };
    };

    "soupsieve" = python.mkDerivation {
      name = "soupsieve-2.0";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/15/53/3692c565aea19f7d9dd696fee3d0062782e9ad5bf9535267180511a15967/soupsieve-2.0.tar.gz";
        sha256 = "e914534802d7ffd233242b785229d5ba0766a7f487385e3f714446a07bf540ae";
};
      doCheck = commonDoCheck;
      buildInputs = commonBuildInputs ++ [ ];
      propagatedBuildInputs = [ ];
      meta = with pkgs.stdenv.lib; {
        homepage = "https://github.com/facelessuser/soupsieve";
        license = licenses.mit;
        description = "A modern CSS selector implementation for Beautiful Soup.";
      };
    };

    "typing" = python.mkDerivation {
      name = "typing-3.7.4.1";
      src = pkgs.fetchurl {
        url = "https://files.pythonhosted.org/packages/67/b0/b2ea2bd67bfb80ea5d12a5baa1d12bda002cab3b6c9b48f7708cd40c34bf/typing-3.7.4.1.tar.gz";
        sha256 = "91dfe6f3f706ee8cc32d38edbbf304e9b7583fb37108fef38229617f8b3eba23";
};
      doCheck = commonDoCheck;
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
        (let src = pkgs.fetchFromGitHub { owner = "nix-community"; repo = "pypi2nix-overrides"; rev = "100c15ec7dfe7d241402ecfb1e796328d0eaf1ec"; sha256 = "0akfkvdakcdxc1lrxznh1rz2811x4pafnsq3jnyr5pn3m30pc7db"; } ; in import "${src}/overrides.nix" { inherit pkgs python; })
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