#
import os, sys, json, lz4.block
file = "/Users/bkb/Library/Application Support/Firefox/Profiles/2m452fsc.default//sessionstore-backups/recovery.jsonlz4"
f = open(file, "rb")
magic = f.read(8)
jdata = json.loads(lz4.block.decompress(f.read()).decode("utf-8"))
#print str(jdata["windows"][0]["selected"])
#id = jdata["windows"][0]["selected"]
f.close()
tablist = []
for win in jdata.get("windows"):
    for tab in win.get("tabs"):
        i = tab.get("index") - 1
        urls = tab.get("entries")[i].get("url")
        tablist = urls

#print tablist
sys.stdout.write(tablist)
