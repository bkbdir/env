function ass; apt-cache search $argv | grep -wi $argv ; end

function el; elinks -remote "openURL($argv)"; end

function serv; python -m SimpleHTTPServer 8000 $argv & ; end


 # Fish editing
function ef; vim ~/.config/fish/config.fish; end
function rf; . ~/.config/fish/config.fish; end



