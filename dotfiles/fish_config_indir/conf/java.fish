# set JAVA_HOME and add to PATH
if [ -f /usr/libexec/java_home ]
   set jpath ""
   for v in 9 8 7 6
      set jpath (/usr/libexec/java_home -v 1.$v 2>/dev/null)
      if [ -d $jpath ] 
         set -gx JAVA_HOME $jpath
         set -gx PATH $JAVA_HOME/bin $PATH
         break
      end
   end
end
 
# Android stuff
set androidsdk $HOME/opt/android-sdk
if [ -d $androidsdk ]
   set -gx ANDROID_SDK_ROOT $androidsdk
   set -gx ANDROID_HOME $androidsdk
   for bindir in  build-tools/26.0.2 tools/bin platform-tools emulator
      if [  -d $ANDROID_HOME/$bindir ]
         set -gx PATH $ANDROID_HOME/$bindir $PATH
      end
   end
end

set emulator_home $HOME/.android
if  [ -d $emulator_home ]
   set -gx ANDROID_EMULATOR_HOME $emulator_home
end
