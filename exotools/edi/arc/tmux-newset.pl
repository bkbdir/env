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

die "Err: no session given" unless $sess;
die "Err: no window given" if $win eq "";
die "Err: no pane given" if $pane eq "";
die "Err: no name given" unless $name;

$tmuxedit = $name . '-edit';
$tmuxview = $name . '-view';
$tmuxout = $name . '-out';

$vimedit = uc($name) . '_EDIT';
$vimview = uc($name) . '_VIEW';

# Check for existing windows
if( grep /\b$name\b/ , qx(tmux list-windows -t $sess ) ){
    die "Err: tmux window $_ already exist"
}

# Check for existing vim servers
if( (grep { chomp; $_ eq $vimedit}   qx(vim --serverlist))){
    die "Err: Editor $vimedit already exists " 
}


qx(
tmux new-window -t "edishell" -n $name ; 
#edit
tmux new-session -d -s $tmuxedit ; 
tmux send-keys -t $tmuxedit:0.0 "vim --servername $vimedit" C-m;
tmux split-window -t $tmuxedit:0;
tmux resize-pane -t $tmuxedit:0 -D 7;
tmux send-keys -t $sess:$name.0 "set TMUX; tmux attach -t $tmuxedit" C-m; 

#out
tmux split-window -t $sess:$name -h ;
tmux split-window -t $sess:$name.1 -v ;
tmux send-keys -t $sess:$name.1 "set TMUX; tmux new -s $tmuxout" C-m; 

tmux select-pane -t $sess:$name.2
tmux resize-pane -t $sess:$name -U 3;
#view
tmux send-keys -t $sess:$name.2 "view --servername $vimview" C-m;
);

#tmux new-session -d -s $tmuxview; 
#tmux send-keys -t $sess:$name.2 "set TMUX; tmux attach -t $tmuxview" C-m; 



#tmux send-keys -t $sess:$win.$pane "tmux new-session -s ${win}_edit \\; send-keys  'vim --servername $vimedit' C-m \\; split-window -v \\; resize-pane -D 3"  C-m ; 
#);
#tmux select-pane -t 0 );
__END__
);





