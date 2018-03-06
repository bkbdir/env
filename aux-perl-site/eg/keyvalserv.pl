
use warnings;
use strict;

use Bkb::Server;
use Bkb::Server::Keyval;

my $socket = Bkb::Server::create(3333);

my $action = \&Bkb::Server::Keyval::action;


Bkb::Server::loop($socket, $action);

Bkb::Server::close($socket);

