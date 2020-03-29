#!/usr/bin/env bash

source ./tools/manage-parsing.sh
source ./tools/ansi_colors.sh

working_dir=`pwd`

function env_backend(){
  info "Change into backend environment"
  cd backend/campusmedius
  if [ "$_arg_editor" = on ]
  then
    info "Run editor"
    nix-shell --command "emacs"
  else
    nix-shell
  fi
}

function env_frontend(){
  info "Change into frontend environment"
  cd frontend/campusmedius
  if [ "$_arg_editor" = on ]
  then
    info "Run editor"
    nix-shell --command "emacs"
  else
    nix-shell
  fi
}

function env_development(){
  # setup a development environment, frontend, backend server and editor and start chrome
  info "Setup development environment"
  info "Start backend"
  $_arg_terminal -e "bash -c 'cd $working_dir; ./manage.sh run backend;'" &
  info "Start frontend"
  $_arg_terminal -e "bash -c 'cd $working_dir; ./manage.sh run frontend;'" &
  info "Open backend editor"
  $_arg_terminal -e "bash -c 'cd $working_dir; ./manage.sh env backend --editor;'" &
  info "Open frontend editor"
  $_arg_terminal -e "bash -c 'cd $working_dir; ./manage.sh env frontend --editor;'" &
  info "Opening backend in browser"
  xdg-open http://localhost:8000/admin &
  info "Opening frontend in browser"
  xdg-open http://localhost:4200 &
}

function init_frontend(){
  info "Init frontend angular project"
  cd frontend/campusmedius
  nix-shell --command "npm install"
}

function init_backend(){
  warning "Nothing to initialize"
}

function init_deployments(){
  cd nix/nixops/development
  mkdir keys
  cd keys
  info "Credentials for basic auth"
  read -p "Username for basic auth [campusmedius]: " USER
  USER=${USER:-campusmedius}
  read -p "Password for basic auth: " PASSWORD
  printf "$USER:$(openssl passwd -5 $PASSWORD)\n" > basicAuth
  info "Generate django secret key"
  tr -dc 'a-z0-9!@#$%^&*(-_=+)' < /dev/urandom | head -c50 > djangoSecret
  cd ../..
  cp -r development/keys staging/
  
  info "Create deployments in nixops for development and staging"
  cd development
  if [[ $(nixops list | grep cm-development) ]]; then
    error "nixops cm-development deployment exists"
  else
    nixops create configuration.nix deployment.nix -d cm-development
  fi
  cd ../staging
  if [[ $(nixops list | grep cm-staging) ]]; then
    error "nixops cm-staging deployment exists"
  else
    nixops create configuration.nix deployment.nix -d cm-staging
  fi
}

function run_backend(){
  info "Run backend server"
  cd backend/campusmedius
  nix-shell --command "python campusmedius/manage.py runserver"
}

function run_frontend(){
  info "Run frontend dev server"
  cd frontend/campusmedius
  nix-shell --command "ng serve"
}

function deploy_development(){
  nixops deploy -d cm-development
  IP=`nixops info -d cm-development --plain | awk -F '\t' '{print $6}'`
  info "Development version runs at: https://$IP"
  info "Backend runs at: https://$IP/api/admin"
}

function deploy_staging(){
  nixops deploy -d cm-staging
  IP=`nixops info -d cm-staging --plain | awk -F '\t' '{print $6}'`
  info "Staging version runs at: https://$IP"
  info "Backend runs at: https://$IP/api/admin"
}

function deploy_production(){
  cd nix/nixops/staging
  # nixops deploy -d cm-univie
}

function ssh_development(){
  nixops ssh -d cm-development campusmedius
}

function ssh_staging(){
  nixops ssh -d cm-staging campusmedius
}

function ssh_production(){
  nixops ssh -d cm-production campusmedius
}

# run command
cmd="${_arg_command}_${_arg_sub_command}"
if [ `type -t $cmd`"" == 'function' ]; then
  $cmd
else
  error "Commond does not exist"
  ./`basename $0` --help
fi
