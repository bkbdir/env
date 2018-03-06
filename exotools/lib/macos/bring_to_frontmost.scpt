on run argv
	tell application "System Events"
    	tell process " to item 1 from argv
        set frontmost to true
		end tell
	end tell
end run
