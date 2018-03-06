#!/bin/sh


aux=$HOME/aux
mkdir -p $aux

rm -f $aux/urxvt-perl
ln -s $(pwd)/urxvt-perl $aux/urxvt-perl

