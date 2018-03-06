#!/usr/bin/perl
#
use strict;
use warnings;
use Aux::Tools::Appcontrol;
use Aux::Tools::Vim;

use POSIX 'uname';

my $Fileinp=$ARGV[0];
my $Servname=$ARGV[1];

my @Vimlist = Aux::Tools::Vim::serverlist();

unless($Servname){
   die "Err: no Vim windows" if (@Vimlist == 0);

   my @keys=reverse qw(a k l r d s t m n o p y w );

   my %idx;
   foreach(@Vimlist){
      chomp;
      my $k = pop @keys;
      $idx{$k} = $_;
      print "$k: $_\n";
   }

   print "Which server?\n";

   open(TTY, "+</dev/tty") or die "no tty: $!";
   system "stty  cbreak </dev/tty >/dev/tty 2>&1";
   my $key = getc(TTY);       # perhaps this works

   die "Err: could not get server" unless exists $idx{$key};

   $Servname = $idx{$key};
   chomp $Servname;
   die "Err: no vim server fetched" unless $Servname;
}


my ($os) = (uname()); 
$os= lc $os; chomp $os;

my %platform=(
   darwin   => sub{
      if($Fileinp){
         system("/usr/local/bin/mvim --servername $Servname --remote $Fileinp");
      }else{
         Aux::Tools::Appcontrol::select_win_macos("MacVim", uc($Servname));
      }
   },
   _ => sub {
      die "Err: todo -$os-"
   }
);
(exists $platform{$os})
   ? $platform{$os}->()
   : $platform{_}->();

