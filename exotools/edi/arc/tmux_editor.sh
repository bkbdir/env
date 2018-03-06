#!/bin/sh
#
#

sess=$1
win=$2
pane=$3



vimedit=$(perl -e 'uc($ARGV[0])' '_EDIT');

my @vims = qx(vim --serverlist);
foreach(@vims){
    die "Err: viewer already exists " if  $_ eq $vimedit;
}

#qx(tmux  new-window -t $sess -n $wintitle );


qx(
tmux new-session -d -s ${win}-edit;
tmux send-keys -t ${win}-edit:0.0 "vim --servername $vimedit" C-m;
tmux split-window -t ${win}-edit:0;
tmux resize-pane -t ${win}-edit:0 -D 7;
tmux select-pane -t ${win}-edit:0.0;
tmux send-keys -t $sess:$win.$pane "set TMUX; tmux attach -t ${win}-edit" C-m; 
);




#tmux send-keys -t $sess:$win.$pane "tmux new-session -s ${win}_edit \\; send-keys  'vim --servername $vimedit' C-m \\; split-window -v \\; resize-pane -D 3"  C-m ; 
#);
#tmux select-pane -t 0 );
__END__
);





