
use warnings;
use strict;

use Bkb::Client;


# create a connecting socket
my ($socket) = Bkb::Client::create(3333);

Bkb::Client::talk($socket, 'set Foo xx 7777');
my $gg = Bkb::Client::talk($socket, 'get Foo xx');

Bkb::Client::talk($socket, 'set Foo yy 555');
my $yy = Bkb::Client::talk($socket, 'get Foo yy');

print 'xxxx ' . $gg . "\n";
print 'nnn ' . $yy . "\n";


#my $xxx =  Bkb::Client::talk($socket, 'get Foo xx' );


Bkb::Client::close($socket);

