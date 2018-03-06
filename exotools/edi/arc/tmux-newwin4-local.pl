#!/usr/bin/perl
#
#
use strict;
use warnings;


#my $sess = qx(tmux display-message -p '#S');
my $sess = $ARGV[0]; 
chomp $sess;

die "Err: no session given" unless $sess;

my $currwin = $ARGV[1]; 
chomp $currwin;
die "Err: no window given" unless $currwin;

#print "Please give name for new window \n";
my $win = $ARGV[2]; 
#my  $win = <STDIN>;
chomp $win;

die "Err: no title" unless $win;
my @wins = qx(tmux list-windows -t $sess);


print "Please enter window title\n";


foreach (@wins){
    /(\d):\s([\w\-\*]*)\s/;

    chomp $2;

    die "Err: this window title already exists" if $2 eq $win;
    die "Err: this window title already exists" if $2 eq $win . '*';

}

my @vims = qx(vim --serverlist);
my $vimview = uc($win) . '_VIEW';

foreach(@vims){
    die "Err: viewer already exists " if  $_ eq $vimview;
}

my $auxsess= $win . '-aux';
my $outsess= $win . '-out';


unless(system("tmux has-session -t $auxsess 2> /dev/null")){
    die "Err: Sessions $auxsess already exists"
}
unless(system("tmux has-session -t $outsess 2> /dev/null")){
    die "Err: Sessions $outsess already exists"
}


qx(

tmux new-session  -d -s $auxsess ;
tmux new-session  -d -s $outsess ;
tmux new-window -t $sess -n $win 
tmux send-keys -t $sess:$win "set TMUX" Enter;

tmux new-window -t $auxsess -n 'mutt'
tmux new-window -t $auxsess -n 'view'
tmux send-keys -t "$auxsess:view"  "view --servername $vimview" C-m ; 
#tmux send-keys -t "$auxsess:mutt"  "mutt" C-m ; 

tmux split-window -t $sess:$win -h ; 
tmux send-keys -t $sess:$win "set TMUX \; tmux attach -t $outsess"  Enter ; 
tmux resize -R 20 ; 
tmux split-window -t $sess:$win -v ; 
tmux resize -U 13 ; 
tmux send-keys -t $sess:$win "set TMUX \; tmux attach -t $auxsess"  Enter ; 
sleep 0.1 
tmux select-pane -t $sess:$win.0 ; 
#tmux select-pane -t .+
#tmux select-pane -t .+; 
);
exit;

#tmux resize -R 20 ; );




