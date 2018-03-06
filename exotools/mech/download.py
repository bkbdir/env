#!/usr/bin/python
import gi
gi.require_version('Gtk', '3.0')
gi.require_version('WebKit2', '4.0')

from gi.repository import Gtk
from gi.repository import Gio
from gi.repository import WebKit2
import sys
import time


# download mhtml and html

Outbase = sys.argv[0]  
Url = sys.argv[1]  

Mhtmlout = Outbase + ".mhtml"


myfile = Gio.File.new_for_path(Mhtmlout)

mydata = ""

Mhtmlres = ""
Htmlres = ""

HOK = False
MOK = False

def close(window):
        Gtk.main_quit()

def endloop ():
	timeout = time.time() + 15   # 5 secs from now
	while True:
            if Mhtmlres and Htmlres:
                print 'fine'
                Gtk.main_quit()    
                break
            elif time.time() > timeout:
                print 'timeout'
                Gtk.main_quit()    
                break
            time.sleep(1)


def callback (go, result):
    global Mhtmlres
    Mhtmlres  = go.save_to_file_finish(result)        
    endloop()

def file_callback (go, result, data):
    global Htmlres
    Htmlres = go.get_data_finish(result)
    print Htmlres
        

def isloaded( webview, event):
        if event == WebKit2.LoadEvent.FINISHED:
            res = webview.get_main_resource()
            myres = res.get_data(None, file_callback, res)
            webview.save_to_file(myfile, WebKit2.SaveMode.MHTML,None, callback)


def main():
        Gtk.init()


        view = WebKit2.WebView()
        view.load_uri(Url)


        window = Gtk.Window()
        window.add(view)
        window.connect("destroy", close)

#        window.show_all()
        view.connect('load-changed', isloaded)


        Gtk.main()
        print("jsdf")



main()
sys.exit()

