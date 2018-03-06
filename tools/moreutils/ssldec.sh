#!/bin/sh


infile=$1

[ -f "$infile" ] || { echo "Err: not finding infile $infile"; exit 1; }

filename=$(basename $infile)
bname=${filename%%.*}
dname=$(dirname $infile)

ext=${filename#*.}
lastext=${filename##*.}
[ "$lastext" = 'ssl' ] || { "Err. must have an ssl ext" ; exit 1 ; }
extrest=${ext%.*}
[ -n "$extrest" ] || { extrest='out' ; }

passtab_script=$HOME/aux/scripts/passtab_passwords.pl

passtab_gpggen=$(perl -e '@l=split/\./,$ARGV[0]; @r = ($l[0] =~ /sym-gpg_(\w+)_(\w+)_([0-9\-]+)_(h.*)/);  print( join "_",(@r)) if @r; ' "$filename")

outfile=
if [ -n "$passtab_gpggen" ];then
   echo "Looks like a sym-gpg file: $bname"

   outfile="$dname/gpg_$passtab_gpggen".$extrest
else
   outfile="$dname/$bname.$extrest"
fi

if [ -f "$passtab_script" ] ; then
   ${passtab_script} "$bname"

   echo "ok password fetched from passstab for $bname"
   sleep 0.5
else
   echo "Warn: no passtab infrastructure. pw has to be entered manually"
fi


echo openssl aes-256-cbc -d -a -in "$infile" -out "$outfile"
openssl aes-256-cbc -d -a -in "$infile" -out "$outfile"


