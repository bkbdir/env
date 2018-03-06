#!/bin/sh
#

# overwrite PERLIB 
PERL5LIB=$HOME/perl5/lib/perl5   
[ -d "$PERL5LIB" ] || { echo "Err: PERL5LIB not valid"; exit 1; }



here=$(perl -MCwd -e 'print Cwd::realpath($ARGV[0])' $0);
heredir=$(dirname $here)

/usr/local/bin/urxvtc -e /bin/bash -c "/usr/local/bin/perl -I $PERL5LIB $heredir/vimserver.pl"
