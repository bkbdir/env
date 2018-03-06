package Bkb::Server::Keyval;

# create an (inmemory) databas direcotry
use strict;
use warnings;

my $Databases = {};

sub set {
   my ($db, $key, $val) = @_;
   return "Err: no db" unless $db;
   return "Err: no key" unless $key;
   return "Err: no val" unless $val;

   $Databases->{$db}->{$key} = $val;
   return ();
}

sub get {
   my ($db, $key) = @_;
   return "Err: no db" unless $db;
   return "Err: no key" unless $key;

   my $val = $Databases->{$db}->{$key};
   return ($val)
      ? (undef, $val)
      : ("Err: key $key not found")
}

# action for the server loop
sub action {
   my ($line) = @_;

   my ($op, $db, $key, $val) = split(/\s/, $line, 4);

   if($op eq 'set'){
      return set($db, $key, $val);
   }elsif($op eq 'get'){
      return get($db, $key);
   }else{
      return ("Err: invalid command " . $op );
   }
}

1;
