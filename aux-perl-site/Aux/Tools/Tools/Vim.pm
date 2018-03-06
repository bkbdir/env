package Aux::Tools::Vim;

use strict;
use warnings;

use Aux::Tools::Appcontrol;


sub vim_implementation {

   my ($os) = qx(uname);
   chomp $os;
   my ($path, $vimi, $appname);
   if ($os eq 'Darwin'){
      if(-f '/usr/local/bin/mvim'){
         ($path, $vimi, $appname) = ('/usr/local/bin', 'mvim', 'MacVim');
      }else{
         die "Err: mvim not istalled"
      }
   }else{
      die "Todo"
   }
   
   return ($path, $vimi, $appname);
}

sub is_vim_running {
   my ($vim_i) = @_;

   Aux::Tools::Appcontrol::is_process_running($vim_i);

}

sub serverlist {
   my ($vimpath, $vimi, $appname) = vim_implementation(); 
   my ($isrun) = ($appname) 
      ? is_vim_running($appname)
      : is_vim_running($vimi);

   if($isrun){
      my @vilist = qx($vimpath/$vimi --serverlist);
      return map { chomp ; $_ ; } @vilist;
   }else{
      return ()
   }
}

1; 
