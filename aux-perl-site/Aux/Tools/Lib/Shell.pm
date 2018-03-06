package Aux::Lib::Shell;
use strict;
use warnings;

use File::Basename qw(dirname basename);
use File::Copy qw(move copy);


sub echo { print "eee"; print @_; }

sub rm { unlink @_ }

sub mv { move @_  }

sub cp { copy @_ }

1;

