use Aux::Tools::Vim;

use strict;
use warnings;

print join("\n", Aux::Tools::Vim::serverlist());
