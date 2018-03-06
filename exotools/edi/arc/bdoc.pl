#!/usr/bin/perl

-d "$ENV{HOME}/docs" || die "Err: no ~/docs";


$word=$ARGV[0];

chomp $word;

die "Err: no word given" unless $word;

$doc=qx(find -L ~/docs -type f | grep $word | /home/ben/bins/sbin/sentaku);
chomp $doc;

die "Err: no doc found" unless $doc;

qx(elinks --remote "openURL(file:///$doc)" );


