(load "./guile/prelude.scm")
;(define fff (shellout "ls" (car args)))

;(display (car fff))
(define (drain-output port)
  (let loop ((chars '())
             (next (read-char port)))
    (if (eof-object? next)
        ; Modified to not return last 'line' with newline
        (list->string (reverse! (cdr chars)))
        (loop (cons next chars)
              (read-char port)))))

(define (qx pipeline)
  (let* ((pipe (open-input-pipe pipeline))
         (output (drain-output pipe)))
    (close-pipe pipe)
    output))

(display (string? (qx "ls")))
