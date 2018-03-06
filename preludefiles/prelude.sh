die () { echo $1; exit 1; }
usage (){ die "usage: $1";  }
realpath () { perl -MCwd -le 'print Cwd::realpath($ARGV[0])' $1 ;}
