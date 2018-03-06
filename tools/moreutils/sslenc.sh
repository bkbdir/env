#!/bin/sh

infile=$1
passtab_gen=$2

[ -f "$infile" ] || { echo "Err: no valid infile" ; exit 1 ; }
passtab_script=$HOME/aux/scripts/passtab_passwords.pl

bname=$(basename $infile)
dname=$(dirname $infile)

#gpg generation
passtab_gpggen=$(perl -e '@l=split/\./,$ARGV[0]; $l[0] =~ /gpg_(\w+)_(\w+)_([0-9\-]+)_(h.*)/ && print $4' "$bname")


outfile=
if [ -n "$passtab_gpggen" ] ; then
   [ -n "$passtab_gen" ] && { echo "Err: the generation comes already from the file, it should no come from the argument $passtab_gen too"; exit 1; }

   echo "Log: looks like a gpg file, turn into 'sym-gpg_...'"

   if [ -f "$passtab_script" ] ; then

      symname="sym-$bname"
      outfile="$dname/$symname"

      ${passtab_script} "$symname"

      echo "ok password fetched from passstab"
      sleep 0.5
   else
      echo "Warn: no passtab infrastructure. pw has to be entered manually"
   fi
else
   passtab_filegen=$(perl -e '@l=split/\./,$ARGV[0]; if(($l[0] =~ /gpg_(\w+)_(\w+)_([0-9\-]+)_(h.*)/) || ($l[0] =~ /.+_(\w+)_(h.*)/)){ print 1}' $bname) 

   if [ -n "$passtab_filegen" ] ; then
      outfile=$infile
   else
      echo "Err: there is no passtab generation info in the file name. Quitting ...."
      exit 1
   fi
fi

openssl aes-256-cbc -a -salt -in "$infile" -out "$outfile.ssl" 

