#!/usr/bin/env bash

# Usage:
#     echo -e "... $(text-style style ...) ..."
#     echo -e "... $(text-reset) ..."
#     echo -e "... $(text-color r g b) ..."
#     echo -e "... $(background-color r g b) ..."
#
# Where:
#     styles:
#       black  red  green  yellow  blue  magenta  cyan  white  default
#       (prefix with 'bg' for background color)
#       bold  faint  normal
#       italic  roman
#       underline  nounderline
#       inverse  negative  positive
#       conceal  reveal
#       strike  nostrike
#       xterm N  (two consecutive arguments)
#       bgxterm N  (two consecutive arguments)
#       reset
#     r/g/b in 0...5 for color triplets
#
# Example:
#     echo -e "This is $(text-color 5 5 0) yellow $(text-reset)"
#     echo -e "This is $(text-style bold blue underline) fancy $(text-reset)"

function _ts {
    while [ $# -gt 0 ]; do
	case "$1" in
	    reset)       echo -ne "\E[0m" ;;  # terminal default

	    bold)        echo -ne "\E[1m" ;;
	    faint)       echo -ne "\E[2m" ;;  # not widely supported (gnome-terminal does)
	    italic)      echo -ne "\E[3m" ;;  # not widely supported
	    underline)   echo -ne "\E[4m" ;;
	    blink)       echo -ne "\E[5m" ;;  # not widely supported
	    blinkfast)   echo -ne "\E[6m" ;;  # not widely supported
	    negative)    echo -ne "\E[7m" ;;
	    conceal)     echo -ne "\E[8m" ;;  # not widely supported (gnome-terminal does)
	    strike)      echo -ne "\E[9m" ;;  # not widely supported (gnome-terminal does)

	    normal)      echo -ne "\E[22m" ;; # cancel bold/faint
	    roman)       echo -ne "\E[23m" ;; # cancel italic
	    nounderline) echo -ne "\E[24m" ;; # cancel underline
	    noblink)     echo -ne "\E[25m" ;; # cancel blink
	    positive)    echo -ne "\E[27m" ;; # cancel negative
	    reveal)      echo -ne "\E[28m" ;; # cancel conceal
	    nostrike)    echo -ne "\E[29m" ;; # cancel strike

	    b)           echo -ne "\E[30m" ;;
	    r)           echo -ne "\E[31m" ;;
	    g)           echo -ne "\E[32m" ;;
	    y)           echo -ne "\E[33m" ;;
	    b)           echo -ne "\E[34m" ;;
	    m)           echo -ne "\E[35m" ;;
	    c)           echo -ne "\E[36m" ;;
	    w)           echo -ne "\E[37m" ;;
	    xterm)       echo -ne "\E[38;5;$2m" ; shift ;;

	    default)     echo -ne "\E[39m" ;;

	    bgb)         echo -ne "\E[40m" ;;
	    bgr)         echo -ne "\E[41m" ;;
	    bgg)         echo -ne "\E[42m" ;;
	    bgy)         echo -ne "\E[43m" ;;
	    bgb)         echo -ne "\E[44m" ;;
	    bgm)         echo -ne "\E[45m" ;;
	    bgc)         echo -ne "\E[46m" ;;
	    bgw)         echo -ne "\E[47m" ;;
	    bgx)         echo -ne "\E[48;5;$2m" ; shift ;;
	    bgd)         echo -ne "\E[49m" ;;

	    *)
		echo -"ne \E[0m"
		echo "Unknown code: $token" 1>&2
		exit 1
		;;
	esac
	shift
    done
}

function _tc {
    _ts xterm $(expr 16 + 36 \* $1 + 6 \* $2 + $3)
}

function _bc {
    _ts bgxterm $(expr 16 + 36 \* $1 + 6 \* $2 + $3)
}

function _tr {
    _ts reset
}
