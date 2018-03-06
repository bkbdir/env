

cwd=$(pwd)

share_perl=$HOME/share/perl


mkdir -p $share_perl
rm -f $share_perl/site
ln -s $cwd $share_perl/site


top=$HOME/top
[ -d "$top" ] && {
   rm -f $top/share
   ln -s $share_perl $top/share

   aux=$top/aux
   mkdir -p $aux
   rm -f $aux/tools.pl
   ln -s $cwd/Aux/Tools $aux/tools.pl

   rm -f $aux/Tools.pm
   ln -s $cwd/Aux/Tools.pm $aux/Tools.pm
}

perlib=$HOME/perl5/lib/perl5/
[ -d "$perlib" ] && {
   rm -f $perlib/Aux
   ln -s $cwd/Aux $perlib/Aux
}
