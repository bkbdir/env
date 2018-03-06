#lang racket

;XXX  SERVER SIDE XXX

(define server-name "localhost")
(define server-port 9877)
(define max-allow-wait 20); max concurrent clients waiting for turn
(define reuse? #f)
(define time-limit 10); secs for each rpc request

(define (allowed? expr);; Filter out illegal requests here
  #t)

(define (run-rpc-server)
  (define (accept-and-handle listener)
    (define cust (make-custodian))
    (custodian-limit-memory cust (* 50 1024 1024))
    (parameterize ((current-custodian cust))
      (define expr "")
      (define-values (client->me me->client) (tcp-accept listener))
      (thread (lambda ()
                (set! expr (read client->me))
                (if (allowed? expr)
                    (write (eval expr) me->client)
                    (error "Illegal procedure call!" me->client))
                (close-output-port me->client)
                (close-input-port client->me))))
    (thread (lambda () ;; Watcher thread
              (sleep time-limit)
              (custodian-shutdown-all cust))))
  (define main-cust (make-custodian))
  (parameterize ((current-custodian main-cust))
    (define listener (tcp-listen server-port max-allow-wait reuse? #f))
    (define (loop)
      (accept-and-handle listener)
      (loop))
    (thread loop))
  (lambda ()
    (custodian-shutdown-all main-cust)))
