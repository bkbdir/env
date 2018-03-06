use Bkb::Client;
use warnings;
use strict;



# create a connecting socket
my ($socket) = Bkb::Client::create();

print Bkb::Client::talk($socket, "Boooobi");
print Bkb::Client::talk($socket, "Booxxxxxoobi");





Bkb::Client::close($socket);

