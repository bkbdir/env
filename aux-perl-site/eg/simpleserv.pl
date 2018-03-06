use Bkb::Server;

use warnings;
use strict;

my $socket = Bkb::Server::create();

my $action = sub {
   return "helllloooo " . $_[0] 
};


Bkb::Server::loop($socket, $action);

Bkb::Server::close($socket);

1;
