package Bkb::Client;

use strict;
use warnings;
use IO::Socket;

sub create {
   my ($port, $address) = @_;
   $port //= 3333;
   $address //= 'localhost';

   my $socket = IO::Socket::INET->new(
   Proto   => 'tcp',       # protocol
   PeerAddr=> $address, # Address of server
   PeerPort=> $port,      # port of server
   Reuse   => 1,
   ) or die "$!";
   return $socket;
}


sub talk {
   my ($socket,$cmd) = @_;
   #print "Connected to ", $socket->peerhost, # Info message
   #      " on port: ", $socket->peerport, "\n";
   $socket->autoflush(1);  # Send immediately

   print $socket $cmd . "\n";
   my $respond =   <$socket>;
   return $respond;
}

sub close{
   my ($socket) = @_;
   shutdown $socket, 2;
   close $socket;                  
}

1;
