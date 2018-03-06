#!/usr/bin/perl 
#
use lib "$ENV{HOME}/.bkb-perlib";

use warnings;
use strict;

#use Bkb::Server;
#use Bkb::Server::Keyval;
#my $socket = Bkb::Server::create(3333);
#my $action = \&Bkb::Server::Keyval::action;

#Bkb::Server::loop($socket, $action);
#Bkb::Server::close($socket);
#
use Bkb::X11;



#Bkb::X11::list_windows();
#print Bkb::X11::active_app();
my ($appnames, $appids) =Bkb::X11::running_apps_indeces();

my ($active_app) =  Bkb::X11::active_app();


my $guiterm;
if($ENV{GUITERM}){
   $guiterm = $ENV{GUITERM}
}else{
   $guiterm = 'lxterminal'
}


if($active_app eq 'chromium'){
   Bkb::X11::activate_app($appnames, $guiterm);
}elsif($active_app eq $guiterm){
   Bkb::X11::activate_app($appnames,'chromium');
}else{

   Bkb::X11::activate_app($appnames, $guiterm);
}


