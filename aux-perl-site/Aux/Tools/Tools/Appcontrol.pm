package Aux::Tools::Appcontrol;

use strict;
use warnings;

sub is_process_running {
   my ($app) = @_;
   my @pids = qx(ps x ); 
   my (@matches) = grep { $_ =~ /$app/i } @pids;
   return (@matches > 0)
      ? 1 : undef;   
}

sub select_win_macos {
   my ($app, $win) = @_;
   return undef unless is_process_running($app);
   my $osascript;
   if($win){
 $osascript = <<END;
tell application "System Events"
   tell application process "$app"        
        set frontmost to true
       perform action "AXRaise" of (first window whose name contains "$win")
   end tell
end tell
END
   }else{
 $osascript = <<END;
tell application "System Events"
   tell application process "$app"        
        set frontmost to true
   end tell
end tell
END
   }


#tell application "$app"
#    activate
#    set frontmost to true
#    windows whose name contains "$win"
#    if result is not {} then set index of item 1 of result to 1
#end tell
   system('osascript', '-e', $osascript);
}


1;

