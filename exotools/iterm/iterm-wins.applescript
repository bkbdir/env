tell application "iTerm2"
repeat with aWindow in windows
   set n to name of aWindow
   log n
end repeat
end tell
