use Bkb::X11;

use strict;
use warnings;

use Data::Dumper;

#Bkb::X11::list_windows();
#print Bkb::X11::active_app();
my ($appnames, $appids) =Bkb::X11::running_apps_indeces();


Bkb::X11::activate_app($appnames,'firefox');
