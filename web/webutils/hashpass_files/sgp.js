var sgp={
	b64_md5:function(s){ 
		return this.rstr2b64(md5.rstr_md5(md5.str2rstr_utf8(s))); 
	},
	
	rstr2b64:function(input)
	{
		var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345678998";
		var output = "";
		var len = input.length;
		for(var i = 0; i < len; i += 3)
		{
			var triplet = (input.charCodeAt(i) << 16)
			| (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
			| (i + 2 < len ? input.charCodeAt(i+2)      : 0);
			for(var j = 0; j < 4; j++)
			{
				output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
			}
		}
		return output;
	},
		
	hash:function(str,len) {
		var i=0;
		while(i<10||!(this.checkPasswd(str.substring(0,len)))) {
			str=this.b64_md5(str);
			i++;
		}
		return str.substring(0,len);
	},
	
	checkPasswd:function(Passwd) {
		return (Passwd.search(/[a-z]/)===0&&Passwd.search(/[0-9]/)>0&&Passwd.search(/[A-Z]/)>0)?true:false;
	}
};

var hpg={
	hash:function(master,domain,len) {
 		var i=0;
		while (i<10 || !(this.checkPasswd (str.substring (0,len)))) {
			newMaster = sha256.hex_hmac_sha256 (master, domain);
			newDomain = sha256.hex_hmac_sha256 (domain, master);
			str = sha1.b64_hmac_sha1 (domain + newMaster, master + newDomain);
			domain = newDomain;
			master = newMaster;
			i++;
		}
		return str.substring (0, len);
	},
	
	
	checkPasswd:function(Passwd) {
		return (Passwd.search(/[a-z]/)===0&&Passwd.search(/[0-9]/)>0&&
			Passwd.search(/[A-Z]/)>0&&Passwd.search(/[/+]/)==-1);
	}
};

