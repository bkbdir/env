(use util.match)
(use gauche.record)
(use util.record)

(display "hello")
(define-record-type point #f #f x y z)
;
;(define p (make-point 55 88 44))
;
;(match p
;       (($ point x y z) (display z))
;       (_ (display 99)))
