#!/usr/bin/perl
#
#


my $sess = $ARGV[0];
chomp $sess;

my $wintitle = $ARGV[1];
chomp $wintitle;

my $file = $ARGV[2];
chomp $file if $file;

my @wins = qx(tmux list-windows -t $sess);



#die "Err: no title" unless $wintitle;

my $exists = 0;
foreach (@wins){
    /(\d):\s([\w\-\*]*)\s/;

    chomp $2;

    $exists++ if $2 eq $wintitle;
    $exists++ if $2 eq $wintitle . '*';
    $exists++ if $2 eq $wintitle . '-';

}

#die "Err: window title $wintitle not exists" unless $exists;

my @vims = qx(vim --serverlist);

@parts = split '-', $sess;

my $vimview = uc($parts[0]) . '_VIEW';

my $viewexist = 0;
foreach(@vims){
    chomp;
    $viewexist++ if  $_ eq $vimview;
}

die "Err: no viewer open for $vimview" unless $viewexist;

if($file){
    qx(view --servername $vimview --remote $file);
}else{
    my $rangerfile = $ENV{HOME} . "/var/rangerfile";
    system("/usr/bin/ranger --choosefile=$rangerfile $ENV{HOME}/dev");
    open(my $f, '<', $rangerfile) or die "Err $rangerfile $!\n";
    my $file = do { local($/); <$f> };
    close($f);
    ( -f $file ) && qx(view --servername $vimview --remote-tab $file);
}

