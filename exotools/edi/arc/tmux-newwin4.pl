#!/usr/bin/perl
#
#
use strict;
use warnings;


#my $sess = qx(tmux display-message -p '#S');
my $sess = $ARGV[0]; 
chomp $sess;

die "Err: no session given" unless $sess;

my $win = $ARGV[0]; 
chomp $win;
die "Err: no window given" unless $win;

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



qx(tmux  new-window -t $sess -n $wintitle ;
tmux split-window -t $sess:$wintitle -h ; 
tmux resize -R 20 ; 
tmux split-window -t $sess:$wintitle -v ; 
tmux resize -U 13 ; 
tmux select-pane -t.- ; 
sleep 2 
tmux send-keys -t $sess:$wintitle "set TMUX \; tmux attach -t output"  Enter ; 
tmux select-pane -t .+
tmux send-keys -t $sess:$wintitle "view --servername $vimview" C-m ; 
tmux select-pane -t .+; 
);
exit;

#tmux resize -R 20 ; );




