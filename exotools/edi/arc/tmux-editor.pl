#!/usr/bin/perl
#


$sess = $ARGV[0];
chomp $sess;
$win = $ARGV[1];
chomp $win;
$pane = $ARGV[2];
chomp $pane;

$name = $ARGV[3];
chomp $name;


$tmuxedit = $win . '-edit';

$vimedit = uc($win) . '_EDIT';

if( (grep { chomp; $_ eq $vimedit}   qx(vim --serverlist))){
    die "Err: Editor $vimedit already exists " 
}

qx(
tmux new-session -d -s $tmuxedit;
tmux send-keys -t $tmuxedit:0.0 "vim --servername $vimedit" C-m;
tmux split-window -t $tmuxedit:0;
tmux resize-pane -t $tmuxedit:0 -D 7;
tmux select-pane -t $tmuxedit:0.0;
tmux send-keys -t $sess:$win.$pane "set TMUX; tmux attach -t $tmuxedit" C-m; 
);




#tmux send-keys -t $sess:$win.$pane "tmux new-session -s ${win}_edit \\; send-keys  'vim --servername $vimedit' C-m \\; split-window -v \\; resize-pane -D 3"  C-m ; 
#);
#tmux select-pane -t 0 );
__END__
);





