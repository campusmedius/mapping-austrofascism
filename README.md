# Campus Medius

Code for [Campus Medius](https://campusmedius.net/)

For mapping docs see [here](https://github.com/campusmedius/campusmedius/tree/master/mapping).

## Getting Started

### Prerequisites

The project is build and deployed with the [Nix package manager](https://nixos.org/nix/).

Install nix:

```sh
curl -L https://nixos.org/nix/install | sh
```

To deploy the app, instal [nixops](https://github.com/NixOS/nixops):

```sh
nix-env -i nixops
```

### Installing

```sh
git clone https://github.com/campusmedius/campusmedius.git
cd campusmedius
```

### Initial setup

To initialize the npm packages for the angular project use:

```sh
./manage.sh init frontend
```

### Development Environment

To initialize a development environment use the follwoing command.

```sh
./manage.sh env development
```

The command starts the frontend and backend server, the editor for frontend and backend and opens the browser windows for frontend and backend.

### Generate Search Assets

For search we use [lunr.js](https://lunrjs.com/). The search documents are fetched from backend endpoints. Download the search documents and generate the search index with the following script:

```sh
./generate-search-assets.sh
```

### Manage script

The `manage.sh` script uses [argbash](https://github.com/matejak/argbash) for argument parsing, the parsing script is located in the tools directory. Build with:

```sh
argbash tools/manage-parsing.sh -o tools/manage-parsing.sh
```

Generate manpage with:

```sh
argbash --type manpage --strip all tools/manage-parsing.sh -o tools/manage.man
```

## Deployment

We use [nixops](https://github.com/NixOS/nixops) for deployment. There are two local deployments, development and staging, and one production deployment.

To initalize nixops and setup keys use:

```sh
./manage.sh init deployments
```

### Development

For development deployment we use the local packages from `backend/campusmedius/nix` und `frontend/campusmedius/nix`. The overlay is defined in `nix/overlays/campusmedius-development-overlay.nix`.

```sh
./manage.sh deploy development
```

The development and staging deployment uses Virtualbox. Access VM with:

```sh
./manage.sh ssh development
```

### Staging

Upgrade the version with:

```sh
./manage.sh upgrade backend
./manage.sh upgrade frontend
```

For upgrade nix-prefetch-git and jq is required:

```sh
nix-env -iA nixos.nix-prefetch-git
nix-env -iA nixos.jq
```

To deploy the staging version:

```sh
./manage.sh deploy staging
```

### Production

The production version is running at Uni Wien.

```sh
./manage.sh deploy production
```

## Packages

### Update Backend Packages

To generate the nix expressions for the backend python packages pypi2nix is needed.

```sh
nix-env -iA nixos.pypi2nix
```

Edit `backend/campusmedius/nix/requirements.txt` and run:

```sh
pypi2nix -V python37 -r requirements.txt
```

For use in staging and production environment copy the generated nix files to `nix/overlays/pkgs/cm-backend`