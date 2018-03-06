package Aux::Tools::Match;

use strict;

use warnings;

sub case{
   my ($value, $cases, $underscore, $default, @args) = @_;

   die "Err: syntax err, default case symbol is '_' " unless ($underscore eq '_');

   if (exists $cases->{$value}) {
      my $res = $cases->{$value};
      return (ref $res eq 'CODE') ? $res : sub { $res };
   }else{
      return (ref $default eq 'CODE') ? $default : sub { $default };
   }
}


1;
