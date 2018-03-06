package Aux::Tools::Case;

use strict;

use warnings;

sub case_debug{
   my ($value, $cases, $underscore, $default) = @_;

   die "Err: syntax err, default case symbol is '_' " unless ($underscore eq '_');

   return  (exists $cases->{$value}) ? $cases->{$value} : $default ;
}

my ($value, $cases, $default) = (0 .. 2);
sub case_nodebug{
   #      0         1      2 
   #my ($value, $cases,  $default) = @_;

   return $_[$default] unless (defined $_[$value]);

   return  (exists $_[$cases]->{$_[$value]}) ? $_[$cases]->{$_[$value]} : $_[$default];
}

sub init {
   my ($debug) = @_;

   if ($debug) {
      die "Todo"
   }else{
      \&case_nodebug
   }
}

1;
