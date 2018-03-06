#!/bin/sh


edibin=$HOME/bins/edibin




[ -d $HOME/bins ] || mkdir -p $HOME/bins

rm -f $edihome
ln -s $(pwd) $edihome 

rm -f $edibin
ln -s $(pwd)/bin $edibin 

rm -rf $HOME/io/tmp/edisearch
mkdir -p $HOME/io/tmp/edisearch


