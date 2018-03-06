--property theURL : ""

tell application "Safari"
  set theURL to URL of front document
  set theTitle to name of front document
  -- set the clipboard to theTitle & return & theURL as string
  return theURL
end tell
