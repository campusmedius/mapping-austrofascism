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

function env_develop(){
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

# run command
cmd="${_arg_command}_${_arg_sub_command}"
if [ `type -t $cmd`"" == 'function' ]; then
  $cmd
else
  error "Commond does not exist"
  ./`basename $0` --help
fi
