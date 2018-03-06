
-- copied from: https://gist.github.com/autonome/c6d26250125047963f322f837a7aefa2

tell application "Google Chrome"
	set urlChrome to get URL of active tab of first window
	-- Delete the line below if you want to keep the tab open in both browser
	delete tab (active tab index of window 1) of window 1
end tell

tell application "Firefox"
	open location urlChrome
	activate
end tell

