#!/usr/bin/env bash

source ./tools/manage-parsing.sh
source ./tools/ansi_colors.sh

working_dir=`pwd`

# env
if [ "$_arg_command" = "env" ]
then
  if [ "$_arg_sub_command" = "backend" ]
  then
    echo -e "$(text-style yellow)Change into backend environment$(text-style reset)"
    cd backend/campusmedius

    if [ "$_arg_editor" = on ]
    then
      echo -e "$(text-style yellow)Run editor$(text-style reset)"
      nix-shell --command "emacs"
    else
      nix-shell
    fi
  fi
  if [ "$_arg_sub_command" = "frontend" ]
  then
    echo -e "$(text-style yellow)Change into frontend environment$(text-style reset)"
    cd frontend/campusmedius
    
    if [ "$_arg_editor" = on ]
    then
      echo -e "$(text-style yellow)Run editor$(text-style reset)"
      nix-shell --command "emacs"
    else
      nix-shell
    fi
  fi
  # setup a development environment, frontend, backend server and editor and start chrome
  if [  "$_arg_sub_command" = "develop" ]
  then
    echo -e "$(text-style yellow)Setup development environment$(text-style reset)"
    $_arg_terminal -e "bash -c 'cd $working_dir; ./manage.sh run backend;'"
    $_arg_terminal -e "bash -c 'cd $working_dir; ./manage.sh run frontend;'"
    # $_arg_terminal -e "bash -c 'cd $working_dir; ./manage.sh env backend --editor;'"
    $_arg_terminal -e "bash -c 'cd $working_dir; ./manage.sh env frontend --editor;'"
    sleep 3
    echo -e "$(text-style yellow)Opening backend in browser$(text-style reset)"
    xdg-open http://localhost:8000/admin &
    echo -e "$(text-style yellow)Opening frontend in browser$(text-style reset)"
    xdg-open http://localhost:4200 &
  fi
fi

# init
if [ "$_arg_command" = "init" ]
then
  if [ "$_arg_sub_command" = "backend" ]
  then
    echo -e "$(text-style red)Nothing to do$(text-style reset)"
  fi
  if [ "$_arg_sub_command" = "frontend" ]
  then
    echo -e "$(text-style yellow)Init frontend angular project$(text-style reset)"
    cd frontend/campusmedius
    nix-shell --command "npm install"
  fi
fi

# run
if [ "$_arg_command" = "run" ]
then
  if [ "$_arg_sub_command" = "backend" ]
  then
    echo -e "$(text-style yellow)Run backend server$(text-style reset)"
    cd backend/campusmedius
    nix-shell --command "python campusmedius/manage.py runserver"
  fi
  if [ "$_arg_sub_command" = "frontend" ]
  then
    echo -e "$(text-style yellow)Run frontend dev server$(text-style reset)"
    cd frontend/campusmedius
    nix-shell --command "ng serve"
  fi
fi


