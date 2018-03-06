#!/bin/sh


cwd=$(pwd)

[ -d ~/aux/ ] || mkdir ~/aux



rm -f $HOME/.vimrc
ln -s $cwd/vimrc ~/.vimrc

rm -f ~/aux/.vimrc
ln -s $cwd/vimrc ~/aux/.vimrc 


rm -f $HOME/.vim
ln -s $cwd ~/.vim

rm -f ~/aux/.vim
ln -s $cwd ~/aux/.vim
