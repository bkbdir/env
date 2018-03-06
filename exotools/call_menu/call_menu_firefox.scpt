on run argv

	tell application "Keyboard Maestro Engine"
		--- GET VARIABLE ---
		-- IF KM Variable does NOT exist, the AS Variable will be set to empty string --
		-- set calcResult to getvariable "Calculation Result"
 
		--- SET VARIABLE ---
		-- IF KM Variable does NOT exist, it will be created --

		setvariable "FIREFOX_URL" to item 1 of argv 
		do script "call_menu_firefox"
	end tell

end run
