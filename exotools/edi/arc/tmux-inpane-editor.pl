#!/usr/bin/perl
#
#
use strict;
use warnings;


my $sess = $ARGV[0];
chomp $sess;

my $wintitle = $ARGV[1];
chomp $wintitle;


my @wins = qx(tmux list-windows -t $sess);



die "Err: no window title" unless $wintitle;
die "Err: no session" unless $sess;

my $exists = 0;
foreach (@wins){
    /(\d):\s([\w\-\*]*)\s/;

    chomp $2;

    $exists++ if $2 eq $wintitle;
    $exists++ if $2 eq $wintitle . '*';
    $exists++ if $2 eq $wintitle . '-';

}


my @vims = qx(vim --serverlist);

my $vimedit = uc($wintitle) . '_EDIT';

foreach(@vims){
    die "Err: viewer already exists " if  $_ eq $vimedit;
}


#qx(tmux  new-window -t $sess -n $wintitle );

qx(
tmux send-keys -t $sess:$wintitle.0 "vim --servername $vimedit" C-m;
tmux split-window  -t $sess:$wintitle -v;
tmux resize-pane -D 3 ;
tmux select-pane -t 0 );
__END__
);





