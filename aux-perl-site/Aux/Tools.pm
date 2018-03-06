package Aux::Tools;

use strict;
use warnings;

use Data::Dumper;

use File::Basename qw(dirname basename);
use File::Copy qw(move copy);

# ------
#
sub debug { 
   my @c = caller(); 
   my $r = $_[0] || '';
   print "Debug: (in $c[1] on ln:$c[2]), " . Dumper $r;
   exit;
}

sub echo { print "eee"; print @_; }

sub rm { unlink @_ }

sub mv { move @_  }

sub cp { copy @_ }

sub import {
    no strict 'refs';

    my $caller = caller;

    while (my ($name, $symbol) = each %{__PACKAGE__ . '::'}) {
        next if      $name eq 'BEGIN';   # don't export BEGIN blocks
        next if      $name eq 'import';  # don't export this sub
        next unless *{$symbol}{CODE};    # export subs only

        my $imported = $caller . '::' . $name;
        *{ $imported } = \*{ $symbol };
    }
}

1;




