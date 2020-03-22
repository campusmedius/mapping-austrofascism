#!/usr/bin/env bash

source ./tools/manage-parsing.sh
source ./tools/ansi_colors.sh

working_dir=`pwd`

# env
if [ "$_arg_command" = "env" ]
then
  if [ "$_arg_sub_command" = "backend" ]
  then
    echo -e "$(_ts y)Change into backend environment$(_tr)"
    cd backend/campusmedius

    if [ "$_arg_editor" = on ]
    then
      echo -e "$(_ts y)Run editor$(_tr)"
      nix-shell --command "emacs"
    else
      nix-shell
    fi
  fi
  if [ "$_arg_sub_command" = "frontend" ]
  then
    echo -e "$(_ts y)Change into frontend environment$(_tr)"
    cd frontend/campusmedius
    
    if [ "$_arg_editor" = on ]
    then
      echo -e "$(_ts y)Run editor$(_tr)"
      nix-shell --command "emacs"
    else
      nix-shell
    fi
  fi
  # setup a development environment, frontend, backend server and editor and start chrome
  if [  "$_arg_sub_command" = "develop" ]
  then
    echo -e "$(_ts y)Setup development environment$(_tr)"
    echo -e "$(_ts y)Start backend$(_tr)"
    $_arg_terminal -e "bash -c 'cd $working_dir; ./manage.sh run backend;'" &
    echo -e "$(_ts y)Start frontend$(_tr)"
    $_arg_terminal -e "bash -c 'cd $working_dir; ./manage.sh run frontend;'" &
    echo -e "$(_ts y)Open backend editor$(_tr)"
    $_arg_terminal -e "bash -c 'cd $working_dir; ./manage.sh env backend --editor;'" &
    echo -e "$(_ts y)Open frontend editor$(_tr)"
    $_arg_terminal -e "bash -c 'cd $working_dir; ./manage.sh env frontend --editor;'" &
    echo -e "$(_ts y)Opening backend in browser$(_tr)"
    xdg-open http://localhost:8000/admin &
    echo -e "$(_ts y)Opening frontend in browser$(_tr)"
    xdg-open http://localhost:4200 &
  fi
fi

# init
if [ "$_arg_command" = "init" ]
then
  if [ "$_arg_sub_command" = "backend" ]
  then
    echo -e "$(_ts r)Nothing to do$(_tr)"
  fi
  if [ "$_arg_sub_command" = "frontend" ]
  then
    echo -e "$(_ts y)Init frontend angular project$(_tr)"
    cd frontend/campusmedius
    nix-shell --command "npm install"
  fi
fi

# run
if [ "$_arg_command" = "run" ]
then
  if [ "$_arg_sub_command" = "backend" ]
  then
    echo -e "$(_ts y)Run backend server$(_tr)"
    cd backend/campusmedius
    nix-shell --command "python campusmedius/manage.py runserver"
  fi
  if [ "$_arg_sub_command" = "frontend" ]
  then
    echo -e "$(_ts y)Run frontend dev server$(_tr)"
    cd frontend/campusmedius
    nix-shell --command "ng serve"
  fi
fi


