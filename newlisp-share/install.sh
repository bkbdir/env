# install my code

site_newlisp=$HOME/share/site-newlisp

cwd=$(pwd)

me=$(basename $cwd)

top=$HOME/top

mkdir -p $site_newlisp

rm -f $site_newlisp/aux-newlisp
ln -s $cwd/aux-newlisp $site_newlisp/aux-newlisp

mkdir -p $top

rm -f $top/share
ln -s $HOME/share $top/share

