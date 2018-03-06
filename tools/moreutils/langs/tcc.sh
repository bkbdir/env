#!/bin/sh


errfile=$(mktemp)

tcc -run -I /usr/include $@ 2> $errfile

[ "$?" -eq 0 ] || { cat $errfile; exit 1; }
