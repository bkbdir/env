on run argv
  tell application "Google Chrome"
    set URL of active tab of window 1 to item 1 of argv
    activate
  end tell
end run
