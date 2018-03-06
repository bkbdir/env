#!/bin/sh


zshdir=$HOME/.zsh

rm -f $HOME/.zshrc

ln -s $(pwd)/zshrc $HOME/.zshrc

rm -rf $zshdir
ln -s $(pwd) $zshdir
