;; newlisp init file
;; 
;(print "dddebug")


(define (split sep str)
   (parse str sep))

(define nl.array array)

(define (_join sep lst)
   (join lst sep)) 

(define (assocget assl key )
  (let ((assval (assoc key assl )))
   (when assval
      (first (rest (assoc key assl ))))))

(define (_lookup assl key)
  (lookup key assl))

(define concat string)
(define (bye '()) (exit))
(define read_file read-file)
(define read_line read-line)
(define (current_line '()) (current-line))
(define fopen open)
(define head first)
(define hd first)
(define tail rest)
(define tl rest)
(define _match case)

(define assoclist list)

;http://artfulcode.marsich.it/util.lsp.src.txt
(define (iter fun arr , size i)
  (setf i -1 size (length arr))
  (until (= (inc i) size)
    (fun (arr i))))

(define (each lst fun)
 (iter fun lst))

;(define lambda fn)

;(unless (getopt "-q")
;  (println "init.lsp loading...done")
;  (println "current working directory: " (pwd)))
(let ((e (env "NEWLISPDIR")))
  (when (and e (not (directory? e)))
    (println "warning: directory " e " not found.")))u

(define (use libname)
    (load (or (exists file?
    (list
        libname
            (append (env "NEWLISPDIR") "/modules/" libname)
            (append (env "HOME") "/share/newlisplib/" libname)
    ))
    (throw-error (list "No such module" libname)))))

 (define (printf) (print (apply format (args))))

(define _open use)

; utils
(define (cp-r in out)
(unless (directory? out) (make-dir out))
 (dolist (nde (directory in {^[^.]}))
   (if (directory? (append in "/"   nde))
       (cp-r (append in "/" nde "/") (append out "/" nde "/"))
       (copy-file  (append in "/" nde) (append out "/" nde)))) )

(define (ls dir)
  (let ((l '()))
     ( dolist ( x (directory dir))
    (if (and (!= x ".") (!= x ".."))
      (push x l)) )))

(define (apply-dir ffunc dfunc dir)
  (dolist (nde (directory dir))
    (if (and (directory? (append dir "/" nde)) 
             (!= nde ".") (!= nde ".."))
        (begin
          (apply-dir ffunc dfunc (append dir "/" nde))
          (dfunc (append dir "/" nde)))
        (ffunc (append dir "/" nde)))))

(define (-e f)
    (cond
        ((file? f) true )
        ((directory? f) true)
        ()
))

; -f
(define (-f f)
  (file? f)
  )

; -d
(define (-d d)
  (directory? d)
  )

; basename
(define (basename path) 
   (last (parse path "/"))) 


; dirname 
(define (dirname path)
 (join (chop (parse path "/|\\\\" 0)) "/"))



(define (rm-rf dir)
    (apply-dir delete-file remove-dir dir)
    (remove-dir dir)
    )

;(constant (global 'BOTPORT ) 31337)
;(constant (global 'BOTIP ) "127.0.0.1")

;(define (bot e) (net-eval BOTIP BOTPORT e 1000))

;(constant (global 'BOTLIBS) "/homes/ben/bot/lisp/libs/")
;(constant (global 'BOTAPPS) "/homes/ben/bot/lisp/apps/")
;(set 'FOO 404)
;(global 'FOO  )
