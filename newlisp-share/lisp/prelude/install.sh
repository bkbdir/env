#!/bin/sh


cwd=$(pwd)
share=$HOME/share/
prelude=$share/prelude

mkdir -p  $share

rm -f $prelude
ln -s $cwd $prelude


aux=$HOME/aux
mkdir -p $aux

rm -f $aux/share
ln -s $share $aux/share

rm -f $aux/prelude
ln -s $cwd $aux/prelude

