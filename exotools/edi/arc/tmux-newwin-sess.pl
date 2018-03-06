#!/usr/bin/perl
#
#
use strict;
use warnings;


my $sess = qx(tmux display-message -p '#S');
chomp $sess;

die $sess;

my @wins = qx(tmux list-windows -t $sess);


print "Please enter window title\n";

my $wintitle = <STDIN>;
chomp $wintitle;

die "Err: no title" unless $wintitle;

foreach (@wins){
    /(\d):\s([\w\-\*]*)\s/;

    chomp $2;

    die "Err: this window title already exists" if $2 eq $wintitle;
    die "Err: this window title already exists" if $2 eq $wintitle . '*';

}

my @vims = qx(vim --serverlist);
my $vimview = uc($wintitle) . '_VIEW';

foreach(@vims){
    die "Err: viewer already exists " if  $_ eq $vimview;
}


qx(tmux  new-window -t $sess -n $wintitle );

qx(tmux  split-window -t $sess:$wintitle -h);

qx(tmux send-keys -t $sess:$wintitle "vim --servername $vimview" C-m);

(-d $ENV{HOME} . '/var/edi/') || mkdir $ENV{HOME} . '/var/edi';

qx(echo $wintitle > $ENV{HOME}/var/edi/ctx);


