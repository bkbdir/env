package Aux::Tools::Passwords::Passtab_profile;

# Create a secret with the help of passtab

my $USAGE = '<token> ("bkb_1S0", ...)  ';

use strict;
use warnings;

use Aux::Tools;

sub run {
   my $token  = $ARGV[0];
   die "usage: $USAGE" unless $token;
   chomp $token;
}

sub foo {
   my $token;
   my ($generation, $systemabbrev, $offset );
   if($token=~ /^(\w+_)(\d+)([A-Z])([0-9]+)[a-z]*$/){
      $generation = $1 . $2 . $3;
      $systemabbrev = $3;
      $offset = $4;
   }else{
      die "Err: could not match token $token";
   }

my %systems = (
   U => 'Userpass',
   T => 'Twikkey',
   G => 'Gpgmaster',
);

my $system = $systems{$systemabbrev};
die "Err: could not resolve '$systemabbrev' system" unless $system;
my $version = "${system}_${generation}";

my $passtabfile = $ENV{HOME} . "/.passtab-" . "${version}.json";
die "Err: there is no passtabfile under $passtabfile" unless (-f $passtabfile);

my $confile = $ENV{HOME} . "/.auxconf/passtab-${version}.conf" ; 

my $passtab = $ENV{HOME} . '/tools/sw/bin/passtab';

my %conf;

if ( -f $confile ) {
   open (my $fh , '<', $confile) || die "Err: couldnt' open $confile";
   while(<$fh>){
      chomp;
      next if (/^\s*#.*$/);
      next if (/^\s*$/);
      my ($k,$v)  = split '=' , $_;
      die "Err: invalid line '$_'" unless $v ;
      die "Err: invalid line '$_'" unless $k ;
      $conf{$k}=$v;
   }
   close $fh;
}else{
   
   print "Note: Could not file conf-file '$confile'.";
   print "Please give 'startcoord' (AA)\n";
   chomp($conf{startcoord} = <STDIN>);
   print "Please give 'sequence' (10SE)\n";
   chomp($conf{sequence} = <STDIN>);
}

my ($coordY, $coordX);
if($conf{startcoord} =~ /([A-Z])([A-Z])/){
   ($coordY,$coordX) = ($1, $2);   
}else{
  die "Err: incorrect/missing startcoord $conf{startcoord}";
}

my ($length, $direction);
if($conf{sequence} =~ /([0-9]+)([A-Z]+)/){
   ($length,$direction) = ($1, $2);   
}else{
  die "Err: incorrect/missing sequence $conf{sequence}";
}


my $coordXnew;
if($offset > 0){
   my @alph = 'A'..'Z'; 

   my $i = 0;
   foreach(@alph) { 
      last if $coordX  eq $_; 
      $i++; 
   }
   die "Err: couldn't find start coord $coordX" if ($i == 26);
   $coordXnew = $alph[$i + $offset];
}else{
   $coordXnew = $coordX;
}
   
my $startcoord =  "$coordY:$coordX";

my ($sequence) = ($length - 1) . ':' . $direction;

my ($key) = qx($passtab --getpass $startcoord --sequence $sequence -i $passtabfile);

print $key;

}

run () unless caller;
1;
