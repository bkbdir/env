package Bkb::X11;

use strict;
use warnings;

use Data::Dumper;

sub xwininfo_list {
   qx(xwininfo -tree -root);
}
sub list_windows {
   print xwininfo_list();
   print grep /_NET_ACTIVE_WINDOW/, xwininfo_list()
}

sub active_app_id {
   my $raw_id =  qx(xprop -root _NET_ACTIVE_WINDOW);
   
   my $id;
   if($raw_id =~ /#\s+(0x\d+)$/){
      $id = $1;
   }else{
      die "Err: couldnt fetch active window id"
   }
   return $id
}

sub active_app {
   my ($raw_id) =  qx(xprop -root _NET_ACTIVE_WINDOW);
   
   my $id;
   if($raw_id =~ /#\s+(0x[0-9a-z]*\d+)$/){
      $id = $1;
   }else{
      die "Err(active_app): couldnt fetch active window id: " . $raw_id
   }

   my $raw_name = qx(xprop -id $id _OB_APP_CLASS);
   my $name;
   if($raw_name =~ /\"([a-zA-Z0-9-]+)\"$/){
      $name = $1;
   }else{
      die "Err: couldn't fetch active app name for raw name" . $raw_name
   }
   return (lc($name), $id);

}

sub running_apps_indeces {

  my @list_raw = qx(wmctrl -lx); 
  die "Err: couldn't fetch running apps" unless (@list_raw > 0);

  my $app_idx;
  my $appid_idx;
  foreach (@list_raw){
     chomp;
     my ($id, $thing, $fullname) = split /\s+/, $_, 4;
     if(/(\w+)\.(\w+)/){
        $app_idx->{lc($2)} = $id;
        $appid_idx->{$id} = lc($2); 
     }else{
        die "Err: couldn't fetch appname"
     }

  }
  return ($app_idx, $appid_idx);

}

sub activate_app{
   my ($appidx, $appname) = @_;

   my $id = $appidx->{$appname};
   die "Err: app $appname not running" unless $id;
   my ($res) = qx(wmctrl -ia $id &);
}
   

1;
