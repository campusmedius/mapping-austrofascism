# campusmedius

Code for campusmedius.org



## Getting Started

### Prerequisites

The project is build and deployed with the [Nix package manager](https://nixos.org/nix/).

Install nix:

```sh
curl -L https://nixos.org/nix/install | sh
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
./manage.sh env develop
```

The command starts the frontend and backend server, the editor for frontend and backend and opens the browser windows for frontend and backend.

### Manage script

The `manage.sh` script uses [argbash](https://github.com/matejak/argbash) for argument parsing, the parsing script is located in the tools directory. Build with:

```sh
argbash tools/manage-parsing.sh -o tools/manage-parsing.sh
```

Generate manpage with:

```sh
argbash --type manpage --strip all tools/manage-parsing.sh -o tools/manage.man
```

