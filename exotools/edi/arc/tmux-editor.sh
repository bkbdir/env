#!/bin/sh
#
#

sess=$1
win=$2
pane=$3

name=$4

vimedit=echo "${name}_edit"  | perl -lne 'print uc';


if vim --serverlist | grep $vimedit ; then
    echo "Err: A vimserver $vimedit already exists"
    exit 1
fi


#qx(tmux  new-window -t $sess -n $wintitle );

tmuxedit=${name}-edit

tmux new-session -d -s $tmuxedit;
tmux send-keys -t $tmuxedit:0.0 "vim --servername $vimedit" C-m;
tmux split-window -t $tmuxedit:0;
tmux resize-pane -t $tmuxedit:0 -D 7;
tmux select-pane -t $tmuxedit:0.0;
tmux send-keys -t $sess:$win.$pane "set TMUX; tmux attach -t $tmuxedit" C-m; 




#tmux send-keys -t $sess:$win.$pane "tmux new-session -s ${win}_edit \\; send-keys  'vim --servername $vimedit' C-m \\; split-window -v \\; resize-pane -D 3"  C-m ; 
#);
#tmux select-pane -t 0 );
__END__
);





