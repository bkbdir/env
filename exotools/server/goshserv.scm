(use gauche.net)
(use gauche.selector)
(use gauche.listener)

(define (scheme-server port)
  (let ((selector (make <selector>))
        (server   (make-server-socket 'inet port :reuse-addr? #t))
        (cid      0))

    (define (accept-handler sock flag)
      (let* ((client (socket-accept server))
             (id     cid)
             (input  (socket-input-port client :buffering :none))
             (output (socket-output-port client))
             (finalize (lambda ()
                         (selector-delete! selector input #f #f)
                         (socket-close client)
                         (format #t "client #~a disconnected\n" id)))
             (listener (make <listener>
                         :input-port input
                         :output-port output
                         :error-port output
                         :prompter (lambda () (format #t "client[~a]> " id))
                         :finalizer finalize))
             (handler (listener-read-handler listener))
             )
        (format #t "client #~a from ~a\n" cid (socket-address client))
        (inc! cid)
        (listener-show-prompt listener)
        (selector-add! selector input (lambda _ (handler)) '(r))))

    (selector-add! selector
                   (socket-fd server)
                   accept-handler
                   '(r))
    (format #t "scheme server started on port ~s\n" port)
    (do () (#f) (selector-select selector))))

(scheme-server 4444)
