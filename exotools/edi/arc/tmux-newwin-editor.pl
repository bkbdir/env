#!/usr/bin/perl
#
#
use strict;
use warnings;


my $sess = qx(tmux display-message -p '#S');
#my $sess = 'edishell';
chomp $sess;

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

my $vimedit = uc($wintitle) . '_EDIT';

foreach(@vims){
    die "Err: viewer already exists " if  $_ eq $vimedit;
}


qx(tmux  new-window -t $sess -n $wintitle );

qx(tmux  split-window -t $sess:$wintitle -v);

qx(tmux send-keys -t $sess:$wintitle "vim --servername $vimedit" C-m);

(-d $ENV{HOME} . '/var/edi/') || mkdir $ENV{HOME} . '/var/edi';

qx(echo $wintitle > $ENV{HOME}/var/edi/ctx);


