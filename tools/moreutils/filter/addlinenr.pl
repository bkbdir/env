#!/usr/bin/perl

$file=$ARGV[0];

$tmpl=$ARGV[1];

open ($fh, '<', $file) || die "Err: couldn't open $file\n";

$i=1;
while(<$fh>){
   printf($tmpl . "\n", $i++);
   print $_;
}

close $fh;
