#!/usr/bin/perl
#
use strict;
use warnings;



my @wins = qx(tmux list-windows -t edi);

my @out;
foreach (@wins){
    /(\d+)\:\s([\w\-\*]*)\s/;
    push @out, $1 . '. ' . $2;
}

my $str = join "\n", @out;


my ($out ) = qx(echo "$str" | rofi -dmenu);
my (@strs ) = split /\.\s/, $out;

chomp $strs[0];

qx(tmux select-window -t edi:$strs[0]);
