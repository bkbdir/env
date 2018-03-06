#!/bin/sh


cwd=$(pwd)

dev=$HOME/dev

[ -d "$dev" ] || mkdir dev


rm -rf $HOME/.vim
rm -f $dev/.vim

rm -rf $HOME/.vimrc.d
rm -f $dev/.vimrc.d

rm -f $HOME/.vimrc
rm -f $dev/.vimrc


ln -s $cwd/vim $HOME/.vim
ln -s $cwd/vim $dev/.vim

ln -s $cwd/vimrc $HOME/.vimrc
ln -s $cwd/vimrc $dev/.vimrc

ln -s $cwd/vimrc.d $HOME/.vimrc.d
ln -s $cwd/vimrc.d $dev/.vimrc.d
