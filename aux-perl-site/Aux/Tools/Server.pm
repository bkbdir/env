package Bkb::Server;

use strict;
use warnings;

use IO::Socket;

sub create {
   my ($port, $address )= @_;
   $port //= 3333;
   $address //= 'localhost';
   my $socket = IO::Socket::INET->new(
      Proto     => 'tcp',             # protocol
      LocalAddr => $address ,  
      LocalPort => $port ,  
         # Host and port to listen to
         # Change the port if 8081 is being used
      Reuse     => 1
   ) or die "$!";
   return $socket;
}

sub loop {
   my ($socket, $action) = @_;
   $socket->listen();       # listen
   $socket->autoflush(1);   # To send response immediately
   print "At your service. Waiting...\n";
   my $addr;       # Client handle
   while ($addr = $socket->accept() ) {     # receive a request
      print   "Connected from: ", $addr->peerhost();  
      print   " Port: ", $addr->peerport(), "\n";
      my $result;             # variable for Result

      while (my $msg = <$addr>) {       # Read all messages from client 
         my ($errcode, $res) = $action->($msg) if $action;
         $res //= '';

         if($errcode){
            chomp $errcode;
            print $addr "Warn: something went wrong: $errcode\n"
         }else{
            chomp $res;
            print "Received: $res";  # server log
            print $addr $res . "\n"; 
         }
      }
      print "Closed connection\n";    # Inform that connection 
      close $addr;    # close client
      print "At your service. Waiting...\n";  
   # Wait again for next request
   }
}

sub close{
   my ($socket) = @_;
   $socket->close();
}

1;
