
now=$(shell date  "+%y.%m.%d")

file-$(now):

index:
	pandoc -s README.md > index.html

clean:
	rm -rf htmlsrc
	rm -rf env-*
	rm -rf project

test: file-$(now)
	echo $(now)

htmlsrc: 
	sh ./build-html.sh

env-html-$(now): htmlsrc 
	mkdir env-html-$(now)
	mv html env-html-$(now)

env-html-$(now).tar.gz: env-html-$(now)
	tar cfvz env-html-$(now).tar.gz env-html-$(now)

indexhtml: 
	echo '<html><body><pre>' > index.html 
	markdown README.md >> index.html
	echo '</pre></body></html>' >> index.html 

env-$(now): indexhtml 
	mkdir env-$(now)
	rsync -av --progress * env-$(now) --exclude env-$(now) 

env-$(now).tar.gz: env-$(now) 
	tar cfvz env-$(now).tar.gz env-$(now) 

tar: env-$(now).tar.gz env-html-$(now).tar.gz
	rm -rf env-$(now)
	rm -rf env-html-$(now)
	rm -f index.html

deploy: rel
	rsync -avz -e "ssh" ../build/ auxsend.org:/home/public/d/env/
	rm -rf env-*
	rm -f *.tar.gz

rel: clean env-html-$(now).tar.gz env-$(now).tar.gz
	[ -e ../build ] || { echo "Err: no ../build folder" ; exit 2 ; } 
	[ -e ../build/htmlsrc ] || mkdir -p ../build/htmlsrc
	rm -f ../build/index.html
	mv env-$(now)/index.html ../build/
	rm -f ../build/archive/env-$(now).tar.gz
	rm -f ../build/archive/env-html-$(now).tar.gz
	mv env-$(now).tar.gz ../build/archive/
	mv env-html-$(now).tar.gz ../build/archive/
	rm -rf  env-$(now)
	rm -rf ../build/htmlsrc/*
	mv env-html-$(now)/* ../build/htmlsrc/
	rm -rf ../build/site
	cp -R site ../build/site
	rm -rf  env-html-$(now)

install:
	sh ./install.sh
