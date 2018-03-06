var msgpgen={
oldHash:function(s) {
	//rather cryptic code taken directly from my bookmarklet version
	var C='0123456789abcdefghijklmnopqrstuvwxyz.', h = 7919, i, j = '';
	for (i=0;i<s.length;i++) {
		h=(h + (h<<5)) + C.indexOf (s.charAt (i))
	}
	while (h!=0) {j+=C.charAt(h % 16);h=h>>>4;}
	return j;
}
}//end msgpgen object
