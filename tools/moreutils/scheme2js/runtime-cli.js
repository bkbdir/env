var sc_lambda, sc_let, sc_context;

function sc_print_debug() {
    sc_print.apply(null, arguments);
}
/*** META ((export *js*)) */
var sc_JS_GLOBALS = this;

var __sc_LINE=-1;
var __sc_FILE="";

/*** META ((export #t)
           (arity -1)) */
function sc_alert() {
   var len = arguments.length;
   var s = "";
   var i;

   for( i = 0; i < len; i++ ) {
       s += sc_toDisplayString(arguments[ i ]);
   }

   return alert( s );
}

/*** META ((export #t) (arity #t)) */
function sc_typeof( x ) {
   if( sc_isSymbol( x ) ) {
      return "symbol";
   } else if( sc_isVector( x ) ) {
      return "vector";
   } else {
      return typeof x;
   }
}

var __sc_errorHook = false;

/*** META ((export error-hook-set!) (arity #t)) */
function sc_errorHookSet( h ) {
   __sc_errorHook = h;
}

/*** META ((export error-hook) (arity #t)) */
function sc_errorHook() {
   return __sc_errorHook;
}

/*---------------------------------------------------------------------*/
/*    sc_error ...                                                     */
/*---------------------------------------------------------------------*/
/*** META ((export #t) (arity -1)) */
function sc_error() {
   var e = new Error( "sc_error" );

   if( arguments.length >= 1 ) {
      e.name = arguments[ 0 ];
      if( arguments.length >= 2 ) {
	 e.message = arguments[ 1 ];
	 if( arguments.length >= 3 ) {
	    e.scObject = arguments[ 2 ];
	    if( arguments.length >= 4 ) {
	       e.scOffset = arguments[ 3 ];
	    } else {
	       e.scOffset = 1;
	    }
	 }
      }
   }

   throw __sc_errorHook ? __sc_errorHook( e, arguments ) : e;
}

/*---------------------------------------------------------------------*/
/*    sc_typeError ...                                                 */
/*---------------------------------------------------------------------*/
/*** META ((export #t) (arity 3)) */
function sc_typeError( proc, type, obj ) {
   var msg = "Type \"" + type + "\" expected, "
      + "\"" + sc_typeof( obj ) + "\" provided";

   return sc_error( proc, msg, obj, arguments.length >= 4 ? arguments[ 3 ] : 2 );
}

/*---------------------------------------------------------------------*/
/*    sc_function_name ...                                             */
/*---------------------------------------------------------------------*/
function sc_function_name( fun ) {
   return ("displayName" in fun) ? fun.displayName : fun;
}

/*---------------------------------------------------------------------*/
/*    sc_arity_check ...                                               */
/*---------------------------------------------------------------------*/
function sc_arity_check( fun, nbargs ) {
   if( !("sc_arity" in fun) ) {
      return fun;
   } else {
      var arity = fun.sc_arity;
      var glop = fun;

      if( (arity == nbargs) || ((arity < 0) && (nbargs >= -1-arity)) ) {
	 // arity correct
	 return fun;
      } else {
	 // arity error
	 var msg = "Wrong number of arguments: " + arity + " expected, "
	    + nbargs + " provided";
	 var obj = sc_function_name( fun );

	 sc_error( "funcall", msg, obj, 2 );
      }
   }
}
   
/*** META ((export #t) (arity 1)) */
function sc_raise(obj) {
    throw obj;
}

/* with-trace and trace-item JS machinery */
var __sc_traceHasConsole = "console"
   /*(( "console" in window )
    && ( "log" in window[ "console" ])
    && ( "groupCollapsed" in window[ "console" ])
    && ( "groupEnd" in window[ "console" ]));*/

var __sc_traceLevel = 0 ;
//var __sc_traceLevel = ( "hop_debug" in window ) ? window[ "hop_debug" ]() : 0;
var __sc_traceBlockStack = null

var sc_withTrace =
   __sc_traceHasConsole ?
   sc_withTraceConsole : function( level, name, thunk ) { return thunk(); };

function sc_withTraceConsole( level, name, thunk ) {
   // full console api described at
   // http://getfirebug.com/wiki/index.php/Console_API
   var tracep = __sc_traceLevel >= level;
   var stack = __sc_traceBlockStack;

   __sc_traceBlockStack = sc_cons( tracep, __sc_traceBlockStack );
   
   if( tracep ) console.group( name );
   
   try {
      return thunk();
   } finally {
      if( tracep ) console.groupEnd();
      __sc_traceBlockStack = stack;
   }
}

/*** META ((export #t) (arity -1)) */
function sc_traceItem() {
    if( __sc_traceBlockStack != null && __sc_traceBlockStack.__hop_car ) {
	if( arguments.length > 0 ) {
	    console.log.apply( console, arguments );
	}
    }
}

/*** META ((export with-handler-lambda) (arity #t)) */
function sc_withHandlerLambda(handler, body) {
    try {
	return body();
    } catch(e) {
	if (!e._internalException)
	    return handler(e);
	else
	    throw e;
    }
}

/*
 * Unserialization
 */
var sc_circle_cache = new Array;

function sc_circle( len, proc, flat ) {
   if( flat ) {
      return proc( undefined );
   } else {
      for( var i = 0; i < len; i++ ) {
	 sc_circle_cache[ i ] = false;
      }
      return sc_circle_force( sc_circle_cache, proc( sc_circle_cache ) );
   }
}

function sc_circle_delay( i ) {
   this.index = i;
}

function sc_circle_force( cache, obj ) {
   if( !(obj instanceof Object) ) {
      return obj;
   } else if( obj instanceof sc_circle_delay ) {
      return cache[ obj.index ];
   } if( sc_isPair( obj ) ) {
      obj.__hop_car = sc_circle_force( cache, obj.__hop_car );
      obj.__hop_cdr = sc_circle_force( cache, obj.__hop_cdr );
      return obj;
   } else if( sc_isVector( obj ) ) {
      for( var i = 0; i < obj.length; i++ ) {
	 obj[ i ] = sc_circle_force( cache, obj[ i ] );
      }
      return obj;
   } else if( obj instanceof sc_Object ) {
      if( !obj.hop_circle_forced ) {
	 var clazz = sc_object_class( obj );
	 var f = sc_class_all_fields( clazz );

	 obj.hop_circle_forced = true;
	 
	 for( i = 0; i < f.length; i++ ) {
	    var n = sc_symbol2jsstring( f[ i ].sc_name );
	    obj[ n ] = sc_circle_force( cache, obj[ n ] );
	 }
	 return obj;
      }
   } else {
      if( "hop_classname" in obj ) {
	 if( !obj.hop_circle_forced ) {
	    obj.hop_circle_forced = true;
	    for( f in obj ) {
	       obj[ f ] = sc_circle_force( cache, obj[ f ] );
	    }
	 }
      }
	 
      return obj;
   }
}
      
function sc_circle_ref( cache, i ) {
   if( cache[ i ] ) {
      return cache[ i ];
   } else {
      return new sc_circle_delay( i );
   }
}

function sc_circle_def( cache, i, v ) {
   cache[ i ] = v;
   return v;
}
   
var sc_properties = new Object();

/*** META ((export #t) (arity #t)) */
function sc_putpropBang(sym, key, val) {
    var ht = sc_properties[sym];
    if (!ht) {
	ht = new Object();
	sc_properties[sym] = ht;
    }
    ht[key] = val;
}

/*** META ((export #t) (arity #t)) */
function sc_getprop(sym, key) {
    var ht = sc_properties[sym];
    if (ht) {
	if (key in ht)
	    return ht[key];
	else
	    return false;
    } else
	return false;
}

/*** META ((export #t) (arity #t)) */
function sc_rempropBang(sym, key) {
    var ht = sc_properties[sym];
    if (ht)
	delete ht[key];
}

/*** META ((export #t) (arity #t)) */
function sc_any2String(o) {
    return sc_jsstring2string(sc_toDisplayString(o));
}    

/*** META ((export #t) (arity #t)
           (peephole (safe-infix 2 2 "==="))
           (type bool))
*/
function sc_isEqv(o1, o2) {
    return (o1 === o2);
}

/*** META ((export #t) (arity #t)
           (peephole (safe-infix 2 2 "==="))
           (type bool))
*/
function sc_isEq(o1, o2) {
    return (o1 === o2);
}

/*** META ((export #t) (arity #t)
           (type bool)
	   (peephole (safe-hole 1 "(typeof (" n ") === 'number')")))
*/
function sc_isNumber(n) {
    return (typeof n === "number");
}

/*** META ((export #t) (arity #t)
           (type bool))
*/
function sc_isComplex(n) {
    return sc_isNumber(n);
}

/*** META ((export #t) (arity #t)
           (type bool))
*/
function sc_isReal(n) {
    return sc_isNumber(n);
}

/*** META ((export #t) (arity #t)
           (type bool))
*/
function sc_isRational(n) {
    return sc_isReal(n);
}

/*** META ((export #t) (arity #t)
           (type bool))
*/
function sc_isInteger(n) {
    return (parseInt(n) === n);
}

/*** META ((export #t) (arity #t)
           (type bool)
           (peephole (postfix ", false")))
*/
// we don't have exact numbers...
function sc_isExact(n) {
    return false;
}

/*** META ((export #t) (arity #t)
           (peephole (postfix ", true"))
	   (type bool))
*/
function sc_isInexact(n) {
    return true;
}

/*** META ((export = =fx =fl)
           (type bool)
           (peephole (safe-infix 2 2 "==="))
           (arity -3))
*/
function sc_equal(x) {
   // This is not the implementation of equal? which is defined in immutable.js
   // and mutable.js
   for (var i = 1; i < arguments.length; i++)
      if (x !== arguments[i])
	 return false;
   return true;
}

/*---------------------------------------------------------------------*/
/*    sc_less ...                                                      */
/*---------------------------------------------------------------------*/
/*** META ((export <)
           (type bool)
           (peephole (infix 2 2 "<") (safe-binary sc_less2))
           (arity -3))
*/
function sc_less(x) {


    for (var i = 1; i < arguments.length; i++) {


	if (x >= arguments[i])
	    return false;
	x = arguments[i];
    }
    return true;
}

/*** META ((export <fx <fl)
           (type bool)
           (peephole (infix 2 2 "<") (safe-binary sc_less2))
           (arity 2))
*/
function sc_less2( x, y ) {



   return x < y;
}

/*---------------------------------------------------------------------*/
/*    sc_greater ...                                                   */
/*---------------------------------------------------------------------*/
/*** META ((export >)
           (type bool)
           (peephole (infix 2 2 ">") (safe-binary sc_greater2))
           (arity -3))
*/
function sc_greater(x, y) {


    for (var i = 1; i < arguments.length; i++) {


	if (x <= arguments[i])
	    return false;
	x = arguments[i];
    }
    return true;
}

/*** META ((export >fx >fl)
           (type bool)
           (peephole (infix 2 2 ">"))
           (arity 2))
*/
function sc_greater2( x, y ) {



   return x > y;
}

/*---------------------------------------------------------------------*/
/*    sc_lessEqual ...                                                 */
/*---------------------------------------------------------------------*/
/*** META ((export <=)
           (type bool)
           (peephole (infix 2 2 "<=") (safe-binary sc_lessEqual2))
           (arity -3))
*/
function sc_lessEqual(x, y) {


    for (var i = 1; i < arguments.length; i++) {


	if (x > arguments[i])
	    return false;
	x = arguments[i];
    }
    return true;
}

/*** META ((export <=fx <=fl)
           (type bool)
           (peephole (infix 2 2 "<="))
           (arity 2))
*/
function sc_lessEqual2( x, y ) {



   return x <= y;
}

/*---------------------------------------------------------------------*/
/*    sc_greaterEqual ...                                              */
/*---------------------------------------------------------------------*/
/*** META ((export >=)
           (type bool)
           (peephole (infix 2 2 ">=") (safe-binary sc_greaterEqual2))
           (arity -3))
*/
function sc_greaterEqual(x, y) {


    for (var i = 1; i < arguments.length; i++) {


	if (x < arguments[i])
	    return false;
	x = arguments[i];
    }
    return true;
}

/*** META ((export >=fx >=fl)
           (type bool)
           (peephole (infix 2 2 ">="))
           (arity 2))
*/
function sc_greaterEqual2( x, y ) {



   return x >= y;
}

/*---------------------------------------------------------------------*/
/*    sc_isZero ...                                                    */
/*---------------------------------------------------------------------*/
/*** META ((export zero? zerofx? zerofl?) (arity #t)
           (type bool)
           (peephole (postfix "=== 0")))
*/
function sc_isZero(x) {


    return (x === 0);
}

/*** META ((export #t) (arity #t)
           (type bool)
           (peephole (postfix "> 0")))
*/
function sc_isPositive(x) {


    return (x > 0);
}

/*** META ((export #t) (arity #t)
           (type bool)
           (peephole (postfix "< 0")))
*/
function sc_isNegative(x) {


    return (x < 0);
}

/*** META ((export odd? oddfx? evenfl?) (arity #t)
           (type bool)
           (peephole (postfix "%2===1")))
*/
function sc_isOdd(x) {


    return (x % 2 === 1);
}

/*** META ((export even? evenfx? evenfl?) (arity #t)
           (type bool)
           (peephole (postfix "%2===0")))
*/
function sc_isEven(x) {


    return (x % 2 === 0);
}

/*** META ((export max maxfl maxfx)
           (arity -2)) */
var sc_max = Math.max;
/*** META ((export min minfl minfx)
           (arity -2)) */
var sc_min = Math.min;


/*---------------------------------------------------------------------*/
/*    HOP_RTS_DEBUG_NUMERIC_TYPE                                       */
/*    -------------------------------------------------------------    */
/*    If set, the type checking of the safe runtime system is          */
/*    implemented with explicit type checks. Otherwise, JavaScript     */
/*    isNaN is used.                                                   */
/*---------------------------------------------------------------------*/

//#define HOP_RTS_DEBUG_NUMERIC_ISNAN 1

/*---------------------------------------------------------------------*/
/*    sc_checkNumericTypes ...                                         */
/*---------------------------------------------------------------------*/





/*---------------------------------------------------------------------*/
/*    sc_plus ...                                                      */
/*---------------------------------------------------------------------*/
/*** META ((export +)
           (peephole (infix 0 #f "+" "0") (safe-binary sc_plus2))
           (arity -1))
*/
function sc_plus() {
    var res = 0;
    for (var i = 0; i < arguments.length; i++) {




       res += arguments[i];
    }








   return res;
}

/*** META ((export +fx +fl)
           (peephole (infix 0 #f "+" "0"))
           (arity 2))
*/
function sc_plus2(x, y) {




   var res = x + y;
   







   return res;
}

/*---------------------------------------------------------------------*/
/*    sc_minus ...                                                     */
/*---------------------------------------------------------------------*/
/*** META ((export - negfx negfl)
           (peephole (minus) (safe-binary sc_minus2))
           (arity -2))
*/
function sc_minus(x) {
   if (arguments.length === 1) {


      return -x;
   } else {
       var res = x;
      
       for (var i = 1; i < arguments.length; i++) {




	  res -= arguments[i];
       }









      return res;
   }
}

/*** META ((export -fx -fl)
           (peephole (minus))
           (arity 2))
*/
function sc_minus2( x, y ) {





   var res = x - y;
   








   return res;
}

/*---------------------------------------------------------------------*/
/*    sc_multi ...                                                     */
/*---------------------------------------------------------------------*/
/*** META ((export *)
           (peephole (infix 0 #f "*" "1") (safe-binary sc_multi2))
           (arity -1))
*/
function sc_multi() {
    var res = 1;
    for (var i = 0; i < arguments.length; i++) {




	res *= arguments[i];
    }







    return res;
}

/*** META ((export *fx *fl)
           (peephole (infix 0 #f "*" "1"))
           (arity 2))
*/
function sc_multi2( x, y ) {




   var res = x * y;
   







   return res;
}

/*---------------------------------------------------------------------*/
/*    sc_div ...                                                       */
/*---------------------------------------------------------------------*/
/*** META ((export /)
           (peephole (div) (safe-binary sc_div2))
           (arity -2))
*/
function sc_div(x) {
    if (arguments.length === 1)
	return 1/x;
    else {
	var res = x;
	for (var i = 1; i < arguments.length; i++) {


	   res /= arguments[i];
	}
	return res;
    }
}

/*** META ((export /fl)
           (peephole (div))
           (arity 2))
*/
function sc_div2(x, y) {




   var res = x / y;
   







   return res;
}


/*---------------------------------------------------------------------*/
/*    abs ...                                                          */
/*---------------------------------------------------------------------*/
/*** META ((export abs absfx absfl)
           (arity 1))
*/
var sc_abs = Math.abs;

/*---------------------------------------------------------------------*/
/*    sc_quotient ...                                                  */
/*---------------------------------------------------------------------*/
/*** META ((export quotient /fx) (arity #t)
           (peephole (hole 2 "parseInt(" x "/" y ")")))
*/
function sc_quotient(x, y) {




   var res = (x / y);
   







   
   return parseInt( res );
}

/*---------------------------------------------------------------------*/
/*    sc_remainder ...                                                 */
/*---------------------------------------------------------------------*/
/*** META ((export remainder remainderfx remainderfl) (arity #t)
           (peephole (infix 2 2 "%")))
*/
function sc_remainder(x, y) {





   var res = x % y;
   








   return res;
}

/*---------------------------------------------------------------------*/
/*    sc_modulo ...                                                    */
/*---------------------------------------------------------------------*/
/*** META ((export modulo modulofx) (arity #t))
*/
function sc_modulo(x, y) {




   
    var remainder = x % y;
   







    // if they don't have the same sign
    if ((remainder * y) < 0)
	return remainder + y;
    else
	return remainder;
}

/*---------------------------------------------------------------------*/
/*    sc_euclid_gcd ...                                                */
/*---------------------------------------------------------------------*/
function sc_euclid_gcd(a, b) {
    var temp;
    if (a === 0) return b;
    if (b === 0) return a;
    if (a < 0) {a = -a;};
    if (b < 0) {b = -b;};
    if (b > a) {temp = a; a = b; b = temp;};
    while (true) {
	a %= b;
	if(a === 0) {return b;};
	b %= a;
	if(b === 0) {return a;};
    };
}

/*---------------------------------------------------------------------*/
/*    sc_gcd ...                                                       */
/*---------------------------------------------------------------------*/
/*** META ((export #t)
           (arity -1))
*/
function sc_gcd() {
    var gcd = 0;
    for (var i = 0; i < arguments.length; i++) {


       gcd = sc_euclid_gcd(gcd, arguments[i]);
    }
    return gcd;
}

/*---------------------------------------------------------------------*/
/*    sc_lcm ...                                                       */
/*---------------------------------------------------------------------*/
/*** META ((export #t)
           (arity -1))
*/
function sc_lcm() {
    var lcm = 1;
    for (var i = 0; i < arguments.length; i++) {


       var f = Math.round(arguments[i] / sc_euclid_gcd(arguments[i], lcm));
       lcm *= Math.abs(f);
    }
    return lcm;
}

// LIMITATION: numerator and denominator don't make sense in floating point world.
//var SC_MAX_DECIMALS = 1000000
//
// function sc_numerator(x) {
//     var rounded = Math.round(x * SC_MAX_DECIMALS);
//     return Math.round(rounded / sc_euclid_gcd(rounded, SC_MAX_DECIMALS));
// }

// function sc_denominator(x) {
//     var rounded = Math.round(x * SC_MAX_DECIMALS);
//     return Math.round(SC_MAX_DECIMALS / sc_euclid_gcd(rounded, SC_MAX_DECIMALS));
// }

/*** META ((export #t)
           (arity 1))
*/
var sc_floor = Math.floor;
/*** META ((export #t)
           (arity 1))
*/
var sc_ceiling = Math.ceil;
/*** META ((export #t)
           (arity 1))
*/
var sc_truncate = parseInt;
/*** META ((export #t)
           (arity 1))
*/
var sc_round = Math.round;

// LIMITATION: sc_rationalize doesn't make sense in a floating point world.

/*** META ((export #t)
           (arity 1))
*/
var sc_exp = Math.exp;
/*** META ((export #t)
           (arity 1))
*/
var sc_log = Math.log;
/*** META ((export #t)
           (arity 1))
*/
var sc_sin = Math.sin;
/*** META ((export #t)
           (arity 1))
*/
var sc_cos = Math.cos;
/*** META ((export #t)
           (arity 1))
*/
var sc_tan = Math.tan;
/*** META ((export #t)
           (arity 1))
*/
var sc_asin = Math.asin;
/*** META ((export #t)
           (arity 1))
*/
var sc_acos = Math.acos;
/*** META ((export #t)
           (arity -2))
*/
var sc_atan = Math.atan;

/*** META ((export #t)
           (arity 1))
*/
var sc_sqrt = Math.sqrt;
/*** META ((export #t)
           (arity 2))
*/
var sc_expt = Math.pow;

// LIMITATION: we don't have complex numbers.
// LIMITATION: the following functions are hence not implemented.
// LIMITATION: make-rectangular, make-polar, real-part, imag-part, magnitude, angle
// LIMITATION: 2 argument atan

/*** META ((export exact->inexact fixnum->flonum) (arity #t)
           (peephole (id)))
*/
function sc_exact2inexact(x) {


    return x;
}

/*** META ((export inexact->exact flonum->fixnum) (arity #t)
           (peephole (postfix "<< 0")))
*/
function sc_inexact2exact(x) {


    return x << 0;
}

function sc_number2jsstring(x, radix) {


    if (radix) {


       return x.toString(radix);
    } else {
       return x.toString();
    }
}

function sc_jsstring2number(s, radix) {
    if (s === "") return false;

    if (radix) {
	var t = parseInt(s, radix);
	if (!t && t !== 0) return false;
	// verify that each char is in range. (parseInt ignores leading
	// white and trailing chars)
	var allowedChars = "01234567890abcdefghijklmnopqrstuvwxyz".substring(0, radix+1);
	if ((new RegExp("^["+allowedChars+"]*$", "i")).test(s))
	    return t;
	else return false;
    } else {
	var t = +s; // does not ignore trailing chars.
	if (!t && t !== 0) return false;
	// simply verify that first char is not whitespace.
	var c = s.charAt(0);
	// if +c is 0, but the char is not "0", then we have a whitespace.
	if (+c === 0 && c !== "0") return false;
	return t;
    }
}

/*** META ((export #t) (arity #t)
           (type bool)
           (peephole (safe-not)))
*/
function sc_not(b) {
    return b === false;
}

/*** META ((export #t) (arity #t)
           (type bool))
*/
function sc_isBoolean(b) {
    return (b === true) || (b === false);
}



function sc_Pair(car, cdr) {
   this.__hop_car = car;
   this.__hop_cdr = cdr;
}

   // MS TO BE FIXED, if pair are to be bound in JS, __hop_car/car
   Object.defineProperty( sc_Pair.prototype, "car", {
      enumerable: true,
      get: function() { return this.__hop_car; },
      set: function( v ) { this.__hop_car = v; }
   } );

   Object.defineProperty( sc_Pair.prototype, "cdr", {
      enumerable: true,
      get: function() { return this.__hop_cdr; },
      set: function( v ) { this.__hop_cdr = v; }
   } );
   


sc_Pair.prototype.toString = function() {
    return sc_toDisplayString(this);
};
sc_Pair.prototype.sc_toWriteOrDisplayString = function(writeOrDisplay) {
    var current = this;

    var res = "(";

    while(true) {
	res += writeOrDisplay(current.__hop_car);
	if (sc_isPair(current.__hop_cdr)) {
	    res += " ";
	    current = current.__hop_cdr;
	} else if (current.__hop_cdr !== null) {
	    res += " . " + writeOrDisplay(current.__hop_cdr);
	    break;
	} else // current.__hop_cdr == null
	    break;
    }
	
    res += ")";

    return res;
};
sc_Pair.prototype.sc_toDisplayString = function() {
    return this.sc_toWriteOrDisplayString(sc_toDisplayString);
};
sc_Pair.prototype.sc_toWriteString = function() {
    return this.sc_toWriteOrDisplayString(sc_toWriteString);
};
// sc_Pair.prototype.sc_toWriteCircleString in IO.js

sc_Pair.prototype.length = function(){
   return sc_length(this);
}
sc_Pair.prototype.reverse = function() {
   return sc_reverse(this);
}
sc_Pair.prototype.forEach = function(p) {
   return sc_forEach(p,this);
}
sc_Pair.prototype.assoc = function(o) {
   return sc_assoc(o,this);
}
sc_Pair.prototype.concat = function() {
   return sc_dualAppend(this,sc_append.apply(this, arguments));
}
/*** META ((export #t) (arity #t)
           (type bool)
           (peephole (safe-postfix " instanceof sc_Pair")))
*/
function sc_isPair(p) {
    return (p instanceof sc_Pair);
}

/*** META ((export #t) (arity #t)
           (type bool)) */
function sc_isEpair(p) {
    return (p instanceof sc_Pair) && ("cer" in p);
}

function sc_isPairEqual(p1, p2, comp) {
    return (comp(p1.__hop_car, p2.__hop_car) && comp(p1.__hop_cdr, p2.__hop_cdr));
}

/*** META ((export #t) (arity #t)
           (peephole (hole 2 "new sc_Pair(" _car ", " cdr ")")))
*/
function sc_cons(car, cdr) {
    return new sc_Pair(car, cdr);
}

/*** META ((export #t) (arity #t)) */
function sc_econs(car, cdr, cer) {
   var p = new sc_Pair(car, cdr);
   p.cer = cer;
   return p;
}

/*** META ((export cons*)
           (arity -2))
*/
function sc_consStar() {
    var res = arguments[arguments.length - 1];
    for (var i = arguments.length-2; i >= 0; i--)
	res = new sc_Pair(arguments[i], res);
    return res;
}

/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_car")))
*/
function sc_car(p) {
   return p.__hop_car;
}

/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_cdr")))
*/
function sc_cdr(p) {
   return p.__hop_cdr;
}

/*** META ((export #t) (arity #t)
           (peephole (postfix ".cer")))
*/
function sc_cer(p) {
   return p.cer;
}

/*** META ((export #t) (arity #t)
           (peephole (safe-hole 2 p ".__hop_car = " val)))
*/
function sc_setCarBang(p, val) {
   p.__hop_car = val;
}

/*** META ((export #t) (arity #t)
           (peephole (safe-hole 2 p ".__hop_cdr = " val)))
*/
function sc_setCdrBang(p, val) {
   p.__hop_cdr = val;
}

/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_car.__hop_car")))
*/
function sc_caar(p) { return p.__hop_car.__hop_car; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_cdr.__hop_car")))
*/
function sc_cadr(p) { return p.__hop_cdr.__hop_car; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_car.__hop_cdr")))
*/
function sc_cdar(p) { return p.__hop_car.__hop_cdr; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_cdr.__hop_cdr")))
*/
function sc_cddr(p) { return p.__hop_cdr.__hop_cdr; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_car.__hop_car.__hop_car")))
*/
function sc_caaar(p) { return p.__hop_car.__hop_car.__hop_car; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_car.__hop_cdr.__hop_car")))
*/
function sc_cadar(p) { return p.__hop_car.__hop_cdr.__hop_car; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_cdr.__hop_car.__hop_car")))
*/
function sc_caadr(p) { return p.__hop_cdr.__hop_car.__hop_car; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_cdr.__hop_cdr.__hop_car")))
*/
function sc_caddr(p) { return p.__hop_cdr.__hop_cdr.__hop_car; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_car.__hop_car.__hop_cdr")))
*/
function sc_cdaar(p) { return p.__hop_car.__hop_car.__hop_cdr; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_cdr.__hop_car.__hop_cdr")))
*/
function sc_cdadr(p) { return p.__hop_cdr.__hop_car.__hop_cdr; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_car.__hop_cdr.__hop_cdr")))
*/
function sc_cddar(p) { return p.__hop_car.__hop_cdr.__hop_cdr; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_cdr.__hop_cdr.__hop_cdr")))
*/
function sc_cdddr(p) { return p.__hop_cdr.__hop_cdr.__hop_cdr; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_car.__hop_car.__hop_car.__hop_car")))
*/
function sc_caaaar(p) { return p.__hop_car.__hop_car.__hop_car.__hop_car; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_car.__hop_cdr.__hop_car.__hop_car")))
*/
function sc_caadar(p) { return p.__hop_car.__hop_cdr.__hop_car.__hop_car; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_cdr.__hop_car.__hop_car.__hop_car")))
*/
function sc_caaadr(p) { return p.__hop_cdr.__hop_car.__hop_car.__hop_car; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_cdr.__hop_cdr.__hop_car.__hop_car")))
*/
function sc_caaddr(p) { return p.__hop_cdr.__hop_cdr.__hop_car.__hop_car; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_car.__hop_car.__hop_car.__hop_cdr")))
*/
function sc_cdaaar(p) { return p.__hop_car.__hop_car.__hop_car.__hop_cdr; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_car.__hop_cdr.__hop_car.__hop_cdr")))
*/
function sc_cdadar(p) { return p.__hop_car.__hop_cdr.__hop_car.__hop_cdr; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_cdr.__hop_car.__hop_car.__hop_cdr")))
*/
function sc_cdaadr(p) { return p.__hop_cdr.__hop_car.__hop_car.__hop_cdr; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_cdr.__hop_cdr.__hop_car.__hop_cdr")))
*/
function sc_cdaddr(p) { return p.__hop_cdr.__hop_cdr.__hop_car.__hop_cdr; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_car.__hop_car.__hop_cdr.__hop_car")))
*/
function sc_cadaar(p) { return p.__hop_car.__hop_car.__hop_cdr.__hop_car; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_car.__hop_cdr.__hop_cdr.__hop_car")))
*/
function sc_caddar(p) { return p.__hop_car.__hop_cdr.__hop_cdr.__hop_car; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_cdr.__hop_car.__hop_cdr.__hop_car")))
*/
function sc_cadadr(p) { return p.__hop_cdr.__hop_car.__hop_cdr.__hop_car; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_cdr.__hop_cdr.__hop_cdr.__hop_car")))
*/
function sc_cadddr(p) { return p.__hop_cdr.__hop_cdr.__hop_cdr.__hop_car; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_car.__hop_car.__hop_cdr.__hop_cdr")))
*/
function sc_cddaar(p) { return p.__hop_car.__hop_car.__hop_cdr.__hop_cdr; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_car.__hop_cdr.__hop_cdr.__hop_cdr")))
*/
function sc_cdddar(p) { return p.__hop_car.__hop_cdr.__hop_cdr.__hop_cdr; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_cdr.__hop_car.__hop_cdr.__hop_cdr")))
*/
function sc_cddadr(p) { return p.__hop_cdr.__hop_car.__hop_cdr.__hop_cdr; }
/*** META ((export #t) (arity #t)
           (peephole (safe-postfix ".__hop_cdr.__hop_cdr.__hop_cdr.__hop_cdr")))
*/
function sc_cddddr(p) { return p.__hop_cdr.__hop_cdr.__hop_cdr.__hop_cdr; }

/*** META ((export #t) (arity #t)) */
function sc_lastPair(l) {
    if (!sc_isPair(l)) sc_error("sc_lastPair: pair expected");
    var res = l;
    var cdr = l.__hop_cdr;
    while (sc_isPair(cdr)) {
	res = cdr;
	cdr = res.__hop_cdr;
    }
    return res;
}

/*** META ((export #t) (arity #t)
           (type bool)
           (peephole (safe-postfix " === null")))
*/
function sc_isNull(o) {
    return (o === null);
}

/*** META ((export #t) (arity #t)
           (type bool))
*/
function sc_isList(o) {
   var rabbit = o;
   var turtle = o;

   while (true) {
       if (rabbit === null ||
	   (rabbit instanceof sc_Pair && rabbit.__hop_cdr === null))
	   return true;  // end of list
       else {
	   if ((rabbit instanceof sc_Pair) &&
	       (rabbit.__hop_cdr instanceof sc_Pair)) {
	       rabbit = rabbit.__hop_cdr.__hop_cdr;
	       turtle = turtle.__hop_cdr;
	       if (rabbit === turtle) return false; // cycle
	   } else
	       return false; // not pair
       }
   }
}

/*** META ((export #t)
           (arity -1))
 */
function sc_list() {
    var res = null;
    var a = arguments;
    for (var i = a.length-1; i >= 0; i--)
	res = new sc_Pair(a[i], res);
    return res;
}

/*** META ((export #t)
           (arity -2))
*/
function sc_iota(num, init, step) {
   var res = null;
   if (!init) init = 0;
   if (!step) step = 1;
   var v = step * (num - 1) + init;
   for (var i = num - 1; i >= 0; i--, v-=step)
      res = new sc_Pair(v, res);
   return res;
}

/*** META ((export #t)
           (arity -2))
*/
function sc_makeList(nbEls, fill) {
    var res = null;
    for (var i = 0; i < nbEls; i++)
	res = new sc_Pair(fill, res);
    return res;
}

/*** META ((export #t) (arity #t)) */
function sc_length(l) {
    var res = 0;
    while (l !== null) {
	res++;
	l = l.__hop_cdr;
    }
    return res;
}

/*** META ((export #t) (arity #t)) */
function sc_remq(o, l) {
    var dummy = { __hop_cdr : null };
    var tail = dummy;
    while (l !== null) {
	if (l.__hop_car !== o) {
	    tail.__hop_cdr = sc_cons(l.__hop_car, null);
	    tail = tail.__hop_cdr;
	}
	l = l.__hop_cdr;
    }
    return dummy.__hop_cdr;
}

/*** META ((export #t) (arity #t)) */
function sc_remqBang(o, l) {
    var dummy = { __hop_cdr : null };
    var tail = dummy;
    var needsAssig = true;
    while (l !== null) {
	if (l.__hop_car === o) {
	    needsAssig = true;
	} else {
	    if (needsAssig) {
		tail.__hop_cdr = l;
		needsAssig = false;
	    }
	    tail = l;
	}
	l = l.__hop_cdr;
    }
    tail.__hop_cdr = null;
    return dummy.__hop_cdr;
}

/*** META ((export #t) (arity #t)) */
function sc_delete(o, l) {
    var dummy = { __hop_cdr : null };
    var tail = dummy;
    while (l !== null) {
	if (!sc_isEqual(l.__hop_car, o)) {
	    tail.__hop_cdr = sc_cons(l.__hop_car, null);
	    tail = tail.__hop_cdr;
	}
	l = l.__hop_cdr;
    }
    return dummy.__hop_cdr;
}

/*** META ((export #t) (arity #t)) */
function sc_deleteBang(o, l) {
    var dummy = { __hop_cdr : null };
    var tail = dummy;
    var needsAssig = true;
    while (l !== null) {
	if (sc_isEqual(l.__hop_car, o)) {
	    needsAssig = true;
	} else {
	    if (needsAssig) {
		tail.__hop_cdr = l;
		needsAssig = false;
	    }
	    tail = l;
	}
	l = l.__hop_cdr;
    }
    tail.__hop_cdr = null;
    return dummy.__hop_cdr;
}

function sc_reverseAppendBang(l1, l2) {
    var res = l2;
    while (l1 !== null) {
	var tmp = res;
	res = l1;
	l1 = l1.__hop_cdr;
	res.__hop_cdr = tmp;
    }
    return res;
}
	
function sc_dualAppend(l1, l2) {
    if (l1 === null) return l2;
    if (l2 === null) return l1;
    var rev = sc_reverse(l1);
    return sc_reverseAppendBang(rev, l2);
}

/*** META ((export append eappend) ;; we want eappend for the quasiquotes.
           (arity -1))
*/
function sc_append() {
    if (arguments.length === 0)
	return null;
    var res = arguments[arguments.length - 1];
    for (var i = arguments.length - 2; i >= 0; i--)
	res = sc_dualAppend(arguments[i], res);
    return res;
}

function sc_dualAppendBang(l1, l2) {
    if (l1 === null) return l2;
    if (l2 === null) return l1;
    var tmp = l1;
    while (tmp.__hop_cdr !== null) tmp=tmp.__hop_cdr;
    tmp.__hop_cdr = l2;
    return l1;
}
    
/*** META ((export #t)
           (arity -1))
*/
function sc_appendBang() {
    var res = null;
    for (var i = 0; i < arguments.length; i++)
	res = sc_dualAppendBang(res, arguments[i]);
    return res;
}

/*** META ((export #t) (arity #t)) */
function sc_reverse(l1) {
    var res = null;
    while (l1 !== null) {
	res = sc_cons(l1.__hop_car, res);
	l1 = l1.__hop_cdr;
    }
    return res;
}

/*** META ((export #t) (arity #t)) */
function sc_reverseBang(l) {
    return sc_reverseAppendBang(l, null);
}

/*** META ((export #t) (arity #t)) */
function sc_take(l, k) {
   var res = null;
   while (k-- > 0) {
      res = sc_cons(l.__hop_car, res);
   } 

   return sc_reverse(res);
}
   
/*** META ((export #t) (arity #t)) */
function sc_listTail(l, k) {
    var res = l;
    for (var i = 0; i < k; i++) {
	res = res.__hop_cdr;
    }
    return res;
}

/*** META ((export #t) (arity #t)) */
function sc_listRef(l, k) {
    return sc_listTail(l, k).__hop_car;
}

/* // unoptimized generic versions
function sc_memX(o, l, comp) {
    while (l != null) {
	if (comp(l.__hop_car, o))
	    return l;
	l = l.__hop_cdr;
    }
    return false;
}
function sc_memq(o, l) { return sc_memX(o, l, sc_isEq); }
function sc_memv(o, l) { return sc_memX(o, l, sc_isEqv); }
function sc_member(o, l) { return sc_memX(o, l, sc_isEqual); }
*/

/* optimized versions */
/*** META ((export #t) (arity #t)) */
function sc_memq(o, l) {
    while (l !== null) {
	if (l.__hop_car === o)
	    return l;
	l = l.__hop_cdr;
    }
    return false;
}
/*** META ((export #t) (arity #t)) */
function sc_memv(o, l) {
    while (l !== null) {
	if (l.__hop_car === o)
	    return l;
	l = l.__hop_cdr;
    }
    return false;
}
/*** META ((export #t) (arity #t)) */
function sc_member(o, l) {
    while (l !== null) {
	if (sc_isEqual(l.__hop_car,o))
	    return l;
	l = l.__hop_cdr;
    }
    return false;
}

/* // generic unoptimized versions
function sc_assX(o, al, comp) {
    while (al != null) {
	if (comp(al.__hop_car.__hop_car, o))
	    return al.__hop_car;
	al = al.__hop_cdr;
    }
    return false;
}
function sc_assq(o, al) { return sc_assX(o, al, sc_isEq); }
function sc_assv(o, al) { return sc_assX(o, al, sc_isEqv); }
function sc_assoc(o, al) { return sc_assX(o, al, sc_isEqual); }
*/
// optimized versions
/*** META ((export #t) (arity #t)) */
function sc_assq(o, al) {
    while (al !== null) {
	if (al.__hop_car.__hop_car === o)
	    return al.__hop_car;
	al = al.__hop_cdr;
    }
    return false;
}
/*** META ((export #t) (arity #t)) */
function sc_assv(o, al) {
    while (al !== null) {
	if (al.__hop_car.__hop_car === o)
	    return al.__hop_car;
	al = al.__hop_cdr;
    }
    return false;
}
/*** META ((export #t) (arity #t)) */
function sc_assoc(o, al) {
    while (al !== null) {
	if (sc_isEqual(al.__hop_car.__hop_car, o))
	    return al.__hop_car;
	al = al.__hop_cdr;
    }
    return false;
}

/*** META ((export #t) (arity #t)) */
function sc_reduce(f, ridentify, l) {
    if (l === null) {
        return ridentify;
    }
    var res = l.__hop_car;
    l = l.__hop_cdr;
    while (l !== null) {
        res = f(l.__hop_car, res);
        l = l.__hop_cdr;
    }
    return res;
}

/* can be used for mutable strings and characters */
function sc_isCharStringEqual(cs1, cs2) { return cs1.val === cs2.val; }
function sc_isCharStringLess(cs1, cs2) { return cs1.val < cs2.val; }
function sc_isCharStringGreater(cs1, cs2) { return cs1.val > cs2.val; }
function sc_isCharStringLessEqual(cs1, cs2) { return cs1.val <= cs2.val; }
function sc_isCharStringGreaterEqual(cs1, cs2) { return cs1.val >= cs2.val; }
function sc_isCharStringCIEqual(cs1, cs2)
    { return cs1.val.toLowerCase() === cs2.val.toLowerCase(); }
function sc_isCharStringCILess(cs1, cs2)
    { return cs1.val.toLowerCase() < cs2.val.toLowerCase(); }
function sc_isCharStringCIGreater(cs1, cs2)
    { return cs1.val.toLowerCase() > cs2.val.toLowerCase(); }
function sc_isCharStringCILessEqual(cs1, cs2)
    { return cs1.val.toLowerCase() <= cs2.val.toLowerCase(); }
function sc_isCharStringCIGreaterEqual(cs1, cs2)
    { return cs1.val.toLowerCase() >= cs2.val.toLowerCase(); }

function sc_Char(c) {
    var cached = sc_Char.lazy[c];
    if (cached)
	return cached;
    this.val = c;
    sc_Char.lazy[c] = this;
    // add return, so FF does not complain.
    return undefined;
}
sc_Char.lazy = new Object();
// thanks to Eric
sc_Char.char2readable = {
    "\x00": "#\\null",
    "\x07": "#\\bell",
    "\x08": "#\\backspace",
    "\x09": "#\\tab",
    "\x0a": "#\\newline",
    "\x0c": "#\\page",
    "\x0d": "#\\return",
    "\x1b": "#\\escape",
    "\x20": "#\\space",
    "\x7f": "#\\delete",

  /* poeticless names */
    "\x01": "#\\soh",
    "\x02": "#\\stx",
    "\x03": "#\\etx",
    "\x04": "#\\eot",
    "\x05": "#\\enq",
    "\x06": "#\\ack",

    "\x0b": "#\\vt",
    "\x0e": "#\\so",
    "\x0f": "#\\si",

    "\x10": "#\\dle",
    "\x11": "#\\dc1",
    "\x12": "#\\dc2",
    "\x13": "#\\dc3",
    "\x14": "#\\dc4",
    "\x15": "#\\nak",
    "\x16": "#\\syn",
    "\x17": "#\\etb",

    "\x18": "#\\can",
    "\x19": "#\\em",
    "\x1a": "#\\sub",
    "\x1c": "#\\fs",
    "\x1d": "#\\gs",
    "\x1e": "#\\rs",
    "\x1f": "#\\us"};

sc_Char.readable2char = {
    "null": "\x00",
    "bell": "\x07",
    "backspace": "\x08",
    "tab": "\x08",
    "newline": "\x0a",
    "page": "\x0c",
    "return": "\x0d",
    "escape": "\x1b",
    "space": "\x20",
    "delete": "\x00",
    "soh": "\x01",
    "stx": "\x02",
    "etx": "\x03",
    "eot": "\x04",
    "enq": "\x05",
    "ack": "\x06",
    "bel": "\x07",
    "bs": "\x08",
    "ht": "\x09",
    "nl": "\x0a",
    "vt": "\x0b",
    "np": "\x0c",
    "cr": "\x0d",
    "so": "\x0e",
    "si": "\x0f",
    "dle": "\x10",
    "dc1": "\x11",
    "dc2": "\x12",
    "dc3": "\x13",
    "dc4": "\x14",
    "nak": "\x15",
    "syn": "\x16",
    "etb": "\x17",
    "can": "\x18",
    "em": "\x19",
    "sub": "\x1a",
    "esc": "\x1b",
    "fs": "\x1c",
    "gs": "\x1d",
    "rs": "\x1e",
    "us": "\x1f",
    "sp": "\x20",
    "del": "\x7f"};
    
sc_Char.prototype.toString = function() {
    return this.val;
};
// sc_toDisplayString == toString
sc_Char.prototype.sc_toWriteString = function() {
    var entry = sc_Char.char2readable[this.val];
    if (entry)
	return entry;
    else
	return "#\\" + this.val;
};

/*** META ((export #t) (arity #t)
           (type bool)
           (peephole (safe-postfix "instanceof sc_Char")))
*/
function sc_isChar(c) {
    return (c instanceof sc_Char);
}

/*** META ((export char=?)
           (arity 2)
           (type bool)
           (peephole (hole 2 c1 ".val === " c2 ".val")))
*/
var sc_isCharEqual = sc_isCharStringEqual;
/*** META ((export char<?)
           (arity 2)
           (type bool)
           (peephole (hole 2 c1 ".val < " c2 ".val")))
*/
var sc_isCharLess = sc_isCharStringLess;
/*** META ((export char>?)
           (arity 2)
           (type bool)
           (peephole (hole 2 c1 ".val > " c2 ".val")))
*/
var sc_isCharGreater = sc_isCharStringGreater;
/*** META ((export char<=?)
           (arity 2)
           (type bool)
           (peephole (hole 2 c1 ".val <= " c2 ".val")))
*/
var sc_isCharLessEqual = sc_isCharStringLessEqual;
/*** META ((export char>=?)
           (arity 2)
           (type bool)
           (peephole (hole 2 c1 ".val >= " c2 ".val")))
*/
var sc_isCharGreaterEqual = sc_isCharStringGreaterEqual;
/*** META ((export char-ci=?)
           (arity 2)
           (type bool)
           (peephole (hole 2 c1 ".val.toLowerCase() === " c2 ".val.toLowerCase()")))
*/
var sc_isCharCIEqual = sc_isCharStringCIEqual;
/*** META ((export char-ci<?)
           (arity 2)
           (type bool)
           (peephole (hole 2 c1 ".val.toLowerCase() < " c2 ".val.toLowerCase()")))
*/
var sc_isCharCILess = sc_isCharStringCILess;
/*** META ((export char-ci>?)
           (arity 2)
           (type bool)
           (peephole (hole 2 c1 ".val.toLowerCase() > " c2 ".val.toLowerCase()")))
*/
var sc_isCharCIGreater = sc_isCharStringCIGreater;
/*** META ((export char-ci<=?)
           (arity 2)
           (type bool)
           (peephole (hole 2 c1 ".val.toLowerCase() <= " c2 ".val.toLowerCase()")))
*/
var sc_isCharCILessEqual = sc_isCharStringCILessEqual;
/*** META ((export char-ci>=?)
           (arity 2)
           (type bool)
           (peephole (hole 2 c1 ".val.toLowerCase() >= " c2 ".val.toLowerCase()")))
*/
var sc_isCharCIGreaterEqual = sc_isCharStringCIGreaterEqual;

var SC_NUMBER_CLASS = "0123456789";
var SC_WHITESPACE_CLASS = ' \r\n\t\f';
var SC_LOWER_CLASS = 'abcdefghijklmnopqrstuvwxyz';
var SC_UPPER_CLASS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function sc_isCharOfClass(c, cl) { return (cl.indexOf(c) != -1); }
/*** META ((export #t) (arity #t)
           (type bool))
*/
function sc_isCharAlphabetic(c)
    { return sc_isCharOfClass(c.val, SC_LOWER_CLASS) ||
	  sc_isCharOfClass(c.val, SC_UPPER_CLASS); }
/*** META ((export #t) (arity #t)
           (type bool)
           (peephole (hole 1 "SC_NUMBER_CLASS.indexOf(" c ".val) != -1")))
*/
function sc_isCharNumeric(c)
    { return sc_isCharOfClass(c.val, SC_NUMBER_CLASS); }
/*** META ((export #t) (arity #t)
           (type bool))
*/
function sc_isCharWhitespace(c) {
    var tmp = c.val;
    return tmp === " " || tmp === "\r" || tmp === "\n" || tmp === "\t" || tmp === "\f";
}
/*** META ((export #t) (arity #t)
           (type bool)
           (peephole (hole 1 "SC_UPPER_CLASS.indexOf(" c ".val) != -1")))
*/
function sc_isCharUpperCase(c)
    { return sc_isCharOfClass(c.val, SC_UPPER_CLASS); }
/*** META ((export #t) (arity #t)
           (type bool)
           (peephole (hole 1 "SC_LOWER_CLASS.indexOf(" c ".val) != -1")))
*/
function sc_isCharLowerCase(c)
    { return sc_isCharOfClass(c.val, SC_LOWER_CLASS); }

/*** META ((export #t) (arity #t)
           (peephole (postfix ".val.charCodeAt(0)")))
*/
function sc_char2integer(c)
    { return c.val.charCodeAt(0); }
/*** META ((export #t) (arity #t)
           (peephole (hole 1 "new sc_Char(String.fromCharCode(" n "))")))
*/
function sc_integer2char(n)
    { return new sc_Char(String.fromCharCode(n)); }

/*** META ((export #t) (arity #t)
           (peephole (hole 1 "new sc_Char(" c ".val.toUpperCase())")))
*/
function sc_charUpcase(c)
    { return new sc_Char(c.val.toUpperCase()); }
/*** META ((export #t) (arity #t)
           (peephole (hole 1 "new sc_Char(" c ".val.toLowerCase())")))
*/
function sc_charDowncase(c)
    { return new sc_Char(c.val.toLowerCase()); }

function sc_makeJSStringOfLength(k, c) {
    var fill;
    if (c === undefined)
	fill = " ";
    else
	fill = c;
    var res = "";
    var len = 1;
    // every round doubles the size of fill.
    while (k >= len) {
	if (k & len)
	    res = res.concat(fill);
	fill = fill.concat(fill);
	len *= 2;
    }
    return res;
}

function sc_makejsString(k, c) {
    var fill;
    if (c)
	fill = c.val;
    else
	fill = " ";
    return sc_makeJSStringOfLength(k, fill);
}

function sc_jsstring2list(s) {
    var res = null;
    for (var i = s.length - 1; i >= 0; i--)
	res = sc_cons(new sc_Char(s.charAt(i)), res);
    return res;
}

function sc_list2jsstring(l) {
    var a = new Array();
    while(l !== null) {
	a.push(l.__hop_car.val);
	l = l.__hop_cdr;
    }
    return "".concat.apply("", a);
}

var sc_Vector = Array;

/* Dont' removed, needed for the JS unmarshalling, (see runtime/json.scm) */
function sc_vector2array(v) {
   return v;
}
   
function sc_VectorToWriteOrDisplayString(writeOrDisplay) {
   if (this.length === 0) return "#()";

   var res = "#(" + writeOrDisplay(this[0]);
   for (var i = 1; i < this.length; i++)
      res += " " + writeOrDisplay(this[i]);
   res += ")";
   return res;
}
   
function sc_VectorToDisplayString() {
   return this.sc_toWriteOrDisplayString(sc_toDisplayString);
}

function sc_VectorToWriteString() {
    return this.sc_toWriteOrDisplayString(sc_toWriteString);
}

if( "defineProperty" in Object ) {
   Object.defineProperty( sc_Vector, "sc_toWriteOrDisplayString", {
      value: sc_VectorToWriteOrDisplayString,
      enumerable: false
   } );
   Object.defineProperty( sc_Vector, "sc_toDisplayString", {
      value: sc_VectorToDisplayString,
      enumerable: false
   } );
   Object.defineProperty( sc_Vector, "sc_toWriteString", {
      value: sc_VectorToWriteString,
      enumerable: false
   } );
} else {
   sc_Vector.prototype.sc_toWriteOrDisplayString = sc_VectorToWriteOrDisplayString;
   sc_Vector.prototype.sc_toDisplayString = sc_VectorToDisplayString;
   sc_Vector.prototype.sc_toWriteString = sc_VectorToWriteString;
}


/*** META ((export vector? array?) (arity #t)
           (type bool))
*/
function sc_isVector(v) {
   if (v instanceof sc_Vector) {
      /*if ("Float32Array" in window) {
	 return !(v instanceof Float32Array);
      } else {*/
	 return true;
     // }
   } else {
      return false;
   }
}

/*** META ((export vector array)
           (arity -1)
           (peephole (vector)))
*/
function sc_vector() {
    var a = new sc_Vector();
    for (var i = 0; i < arguments.length; i++)
	a.push(arguments[i]);
    return a;
}

/*** META ((export vector-length array-length) (arity #t)
           (peephole (postfix ".length")))
*/
function sc_vectorLength(v) {


   return v.length;
}

/*** META ((export vector-ref array-ref) (arity #t)
           (peephole (hole 2 v "[" pos "]")))
*/
function sc_vectorRef(v, pos) {


    return v[pos];
}


/*** META ((export vector-set! array-set!) (arity #t)
           (peephole (hole 3 v "[" pos "] = " val)))
*/
function sc_vectorSetBang(v, pos, val) {


    v[pos] = val;
}

// only applies to vectors
function sc_isVectorEqual(v1, v2, comp) {


    if (v1.length !== v2.length) return false;
    for (var i = 0; i < v1.length; i++)
	if (!comp(v1[i], v2[i])) return false;
    return true;
}

/*** META ((export f32vector?) (arity #t)
           (type bool))
*/
function sc_isF32Vector(v) {
   /*if ("Float32Array" in window) {
      return (v instanceof Float32Array);
   } else {*/
      return (v instanceof sc_Vector);
   //}
}

/*** META ((export make-vector make-array)
           (arity -2))
*/
function sc_makeVector(sz, fill) {


    var a = new sc_Vector(sz);
    if (fill !== undefined)
	sc_vectorFillBang(a, fill);
    return a;
}

/*** META ((export make-f32vector)
           (arity -2))
*/
function sc_makeF32Vector(sz, fill) {


   var a = new sc_Vector(sz);
   //var a = ("Float32Array" in window) ? new Float32Array(sz):new sc_Vector(sz);
      
   if (fill !== undefined)
      sc_vectorFillBang(a, fill);
   return a;
}

/*** META ((export f32vector)
           (arity -1))
*/
function sc_F32vector() {
   var sz = arguments.length;
   var a = new sc_Vector(sz);
   //var a = ("Float32Array" in window) ? new Float32Array(sz):new sc_Vector(sz);
   
   for (var i = 0; i < arguments.length; i++) {


      a[i] = arguments[i];
   }
   
   return a;
}

/*** META ((export u8vector-length) (arity #t)
           (peephole (postfix ".length")))
*/
function sc_u8vectorLength(v) {


   return v.length;
}

/*** META ((export u8vector-set!) (arity #t)
           (peephole (hole 3 v "[" pos "] = " val)))
*/
function sc_u8vectorSetBang(v, pos, val) {


    v[pos] = val;
}

/*** META ((export u8vector-ref) (arity #t)
           (peephole (hole 2 v "[" pos "]")))
*/
function sc_u8vectorRef(v, pos) {


    return v[pos];
}

/*** META ((export s8vector-length) (arity #t)
           (peephole (postfix ".length")))
*/
function sc_s8vectorLength(v) {


   return v.length;
}

/*** META ((export s8vector-set!) (arity #t)
           (peephole (hole 3 v "[" pos "] = " val)))
*/
function sc_s8vectorSetBang(v, pos, val) {


    v[pos] = val;
}

/*** META ((export s8vector-ref) (arity #t)
           (peephole (hole 2 v "[" pos "]")))
*/
function sc_s8vectorRef(v, pos) {


    return v[pos];
}

/*** META ((export f32vector-length) (arity #t)
           (peephole (postfix ".length")))
*/
function sc_f32vectorLength(v) {


   return v.length;
}

/*** META ((export f32vector-set!) (arity #t)
           (peephole (hole 3 v "[" pos "] = " val)))
*/
function sc_f32vectorSetBang(v, pos, val) {


    v[pos] = val;
}

/*** META ((export f32vector-ref) (arity #t)
           (peephole (hole 2 v "[" pos "]")))
*/
function sc_f32vectorRef(v, pos) {


    return v[pos];
}

/*** META ((export vector->list f32vector->list array->list) (arity #t)) */
function sc_vector2list(a) {
    var res = null;
    for (var i = a.length-1; i >= 0; i--)
	res = sc_cons(a[i], res);
    return res;
}

/*** META ((export list->vector list->array) (arity #t)) */
function sc_list2vector(l) {
    var a = new sc_Vector();
    while(l !== null) {
	a.push(l.__hop_car);
	l = l.__hop_cdr;
    }
    return a;
}

/*** META ((export vector-fill! array-fill!) (arity #t)) */
function sc_vectorFillBang(a, fill) {


    for (var i = 0; i < a.length; i++)
	a[i] = fill;
}


/*** META ((export #t) (arity #t)) */
function sc_copyVector(a, len) {


    if (len <= a.length)
	return a.slice(0, len);
    else {
	var tmp = a.concat();
	tmp.length = len;
	return tmp;
    }
}

/*** META ((export #t) (arity -2)
           (peephole (hole 3 a ".slice(" start "," end ")")))
*/
function sc_vectorCopy(a, start, end) {


   return a.slice(start, end);
}

/*** META ((export #t) (arity -4)) */
function sc_vectorCopyBang(target, tstart, source, sstart, send) {


    if (!sstart) sstart = 0;
    if (!send) send = source.length;

    // if target == source we don't want to overwrite not yet copied elements.
    if (tstart <= sstart) {
	for (var i = tstart, j = sstart; j < send; i++, j++) {
	    target[i] = source[j];
	}
    } else {
	var diff = send - sstart;
	for (var i = tstart + diff - 1, j = send - 1;
	     j >= sstart;
	     i--, j--) {
	    target[i] = source[j];
	}
    }
    return target;
}

/*** META ((export #t) (arity -1)) */
function sc_vectorAppend() {
   if( arguments.length === 0 ) {
      return new sc_Vector( 0 );
   }

   if( arguments.length === 1 ) {


   
      return arguments[ 0 ];
   } else {
      var len = 0;
      var i = 0;
      var j = 0;
      
      for( i = 0; i < arguments.length; i++ ) {


	 len += arguments[ i ].length;
      }

      var res = new sc_Vector( len );

      for( i = 0; i < arguments.length; i++ ) {
	 var v = arguments[ i ];
	 sc_vectorCopyBang( res, j, v, 0, v.length );
	 j += v.length;
      }

      return res;
   }
}

function sc_vectorMapRes(res, proc, args) {
   var nbApplyArgs = args.length - 1;
   var applyArgs = new Array(nbApplyArgs);
   var len = res.length;
   


   for (var i = 0; i < len; i++) {
      for (var j = 0; j < nbApplyArgs; j++) {
	 applyArgs[j] = args[j + 1][ i ];
      }
      res[ i ] = proc.apply(null, applyArgs);
   }
   return res;
}

/*** META ((export #t) (arity -2)) */
function sc_vectorMap(proc, v1) {
   if (v1 === undefined) {
      return sc_makeVector(0);
   } else {
      return sc_vectorMapRes(new sc_Vector(v1.length), proc, arguments);
   }
}

/*** META ((export #t) (arity -2)) */
function sc_vectorMapBang(proc, v1) {
   if (v1 === undefined) {
      return false;
   } else {
      return sc_vectorMapRes(v1, proc, arguments);
   }
}

/*** META ((export #t) (arity #t)
           (type bool)
           (peephole (safe-hole 1 "typeof " o " === 'function'")))
*/
function sc_isProcedure(o) {
    return (typeof o === "function");
}

/*** META ((export #t) (arity -3)) */
function sc_apply(proc) {
   var args = new Array();
   
   // first part of arguments are not in list-form.
   for (var i = 1; i < arguments.length - 1; i++) {
      args.push(arguments[i]);
   }

   var l = arguments[arguments.length - 1];
   while (l !== null) {
      args.push(l.__hop_car);
      l = l.__hop_cdr;
   }
   


   
   return proc.apply(null, args);
}

/*** META ((export #t) (arity -2)) */
function sc_map(proc, l1) {
   if (l1 === undefined) {
      return null;
   } else {
      var nbApplyArgs = arguments.length - 1;
      var applyArgs = new Array(nbApplyArgs);
      var revres = null;
      while (l1 !== null) {
	 for (var i = 0; i < nbApplyArgs; i++) {
	    applyArgs[i] = arguments[i + 1].__hop_car;
	    arguments[i + 1] = arguments[i + 1].__hop_cdr;
	 }
	 revres = sc_cons(proc.apply(null, applyArgs), revres);
      }
      return sc_reverseAppendBang(revres, null);
   }
}

/*** META ((export #t) (arity -2)) */
function sc_mapBang(proc, l1) {
    if (l1 === undefined) {
       return null;
    } else {
       var l1_orig = l1;
       var nbApplyArgs = arguments.length - 1;
       var applyArgs = new Array(nbApplyArgs);
      /* firebug seems to break the alias l1=arguments[1] */
       while (arguments[1] !== null) {
	  var tmp = l1;
	  for (var i = 0; i < nbApplyArgs; i++) {
	     applyArgs[i] = arguments[i + 1].__hop_car;
	     arguments[i + 1] = arguments[i + 1].__hop_cdr;
	  }
	  tmp.__hop_car = proc.apply(null, applyArgs);
       }
       return l1_orig;
    }
}
     
/*** META ((export #t) (arity -2)) */
function sc_forEach(proc, l1) {
   if (l1 === undefined) {
      return undefined;
   } else {
      var nbApplyArgs = arguments.length - 1;
      var applyArgs = new Array(nbApplyArgs);
      /* firebug seems to break the alias l1=arguments[1] */
      while (arguments[1] !== null) {
	 for (var i = 0; i < nbApplyArgs; i++) {
	    applyArgs[i] = arguments[i + 1].__hop_car;
	    arguments[i + 1] = arguments[i + 1].__hop_cdr;
	 }
	 proc.apply(null, applyArgs);
      }
      // add return so FF does not complain.
      return undefined;
   }
}

/*** META ((export #t) (arity #t)) */
function sc_filter(proc, l1) {
    var dummy = { __hop_cdr : null };
    var tail = dummy;
    while (l1 !== null) {
	if (proc(l1.__hop_car) !== false) {
	    tail.__hop_cdr = sc_cons(l1.__hop_car, null);
	    tail = tail.__hop_cdr;
	}
	l1 = l1.__hop_cdr;
    }
    return dummy.__hop_cdr;
}

/*** META ((export #t) (arity #t)) */
function sc_findTail(proc, l1) {
   while (l1 !== null) {
      if (proc(l1.__hop_car)) {
	 return l1;
      } else {
	 l1 = l1.__hop_cdr;
      }
   }
}

/*** META ((export #t) (arity #t)) */
function sc_find(proc, l1) {
   var l = sc_findTail(proc, l1);

   return l ? l.__hop_car : false;
}
	 
/*** META ((export #t) (arity #t)) */
function sc_filterBang(proc, l1) {
    var head = sc_cons("dummy", l1);
    var it = head;
    var next = l1;
    while (next !== null) {
        if (proc(next.__hop_car) !== false) {
	    it.__hop_cdr = next
	    it = next;
	}
	next = next.__hop_cdr;
    }
    it.__hop_cdr = null;
    return head.__hop_cdr;
}

function sc_filterMap1(proc, l1) {
    var revres = null;
    while (l1 !== null) {
        var tmp = proc(l1.__hop_car)
        if (tmp !== false) revres = sc_cons(tmp, revres);
        l1 = l1.__hop_cdr;
    }
    return sc_reverseAppendBang(revres, null);
}
function sc_filterMap2(proc, l1, l2) {
    var revres = null;
    while (l1 !== null) {
        var tmp = proc(l1.__hop_car, l2.__hop_car);
        if(tmp !== false) revres = sc_cons(tmp, revres);
	l1 = l1.__hop_cdr;
	l2 = l2.__hop_cdr
    }
    return sc_reverseAppendBang(revres, null);
}

/*** META ((export #t) (arity -2)) */
function sc_filterMap(proc, l1, l2, l3) {
    if (l2 === undefined)
	return sc_filterMap1(proc, l1);
    else if (l3 === undefined)
	return sc_filterMap2(proc, l1, l2);
    // else
    var nbApplyArgs = arguments.length - 1;
    var applyArgs = new Array(nbApplyArgs);
    var revres = null;
    while (l1 !== null) {
	for (var i = 0; i < nbApplyArgs; i++) {
	    applyArgs[i] = arguments[i + 1].__hop_car;
	    arguments[i + 1] = arguments[i + 1].__hop_cdr;
	}
	var tmp = proc.apply(null, applyArgs);
	if(tmp !== false) revres = sc_cons(tmp, revres);
    }
    return sc_reverseAppendBang(revres, null);
}

function sc_any1(proc, l) {
    var revres = null;
    while (l !== null) {
        var tmp = proc(l.__hop_car);
        if(tmp !== false) return tmp;
	l = l.__hop_cdr;
    }
    return false;
}

/*** META ((export #t) (arity -2)) */
function sc_any(proc, l1, l2) {
    if (l1 === undefined)
	return false;
    if (l2 === undefined)
	return sc_any1(proc, l1);
    // else
    var nbApplyArgs = arguments.length - 1;
    var applyArgs = new Array(nbApplyArgs);
    while (l1 !== null) {
	for (var i = 0; i < nbApplyArgs; i++) {
	    applyArgs[i] = arguments[i + 1].__hop_car;
	    arguments[i + 1] = arguments[i + 1].__hop_cdr;
	}
	var tmp =  proc.apply(null, applyArgs);
	if (tmp !== false) return tmp;
    }
    return false;
}

function sc_every1(proc, l) {
    var revres = null;
    var tmp = true;
    while (l !== null) {
        tmp = proc(l.__hop_car);
        if (tmp === false) return false;
	l = l.__hop_cdr;
    }
    return tmp;
}

/*** META ((export #t) (arity -2)) */
function sc_every(proc, l1, l2) {
    if (l1 === undefined)
	return true;
    if (l2 === undefined)
	return sc_every1(proc, l1);
    // else
    var nbApplyArgs = arguments.length - 1;
    var applyArgs = new Array(nbApplyArgs);
    var tmp = true;
    while (l1 !== null) {
	for (var i = 0; i < nbApplyArgs; i++) {
	    applyArgs[i] = arguments[i + 1].__hop_car;
	    arguments[i + 1] = arguments[i + 1].__hop_cdr;
	}
	var tmp = proc.apply(null, applyArgs);
	if (tmp === false) return false;
    }
    return tmp;
}

/*** META ((export #t) (arity #t)
           (peephole (postfix "()")))
*/
function sc_force(o) {
    return o();
}

/*** META ((export #t) (arity #t)) */
function sc_makePromise(proc) {
    var isResultReady = false;
    var result = undefined;
    return function() {
	if (!isResultReady) {
	    var tmp = proc();
	    if (!isResultReady) {
		isResultReady = true;
		result = tmp;
	    }
	}
	return result;
    };
}

function sc_Values(values) {
    this.values = values;
}

/*** META ((export #t) (arity -1)
           (peephole (values)))
*/
function sc_values() {
    if (arguments.length === 1)
	return arguments[0];
    else
	return new sc_Values(arguments);
}

/*** META ((export #t) (arity #t)) */
function sc_callWithValues(producer, consumer) {
   if( !sc_isProcedure(producer) )
      sc_error( "callWithValue", "producer not a procedure", producer );
      
    var produced = producer();
    if (produced instanceof sc_Values)
	return consumer.apply(null, produced.values);
    else
	return consumer(produced);
}

/*** META ((export #t) (arity #t)) */
function sc_dynamicWind(before, thunk, after) {
    before();
    try {
	var res = thunk();
	return res;
    } finally {
	after();
    }
}


// TODO: eval/scheme-report-environment/null-environment/interaction-environment

// LIMITATION: 'load' doesn't exist without files.
// LIMITATION: transcript-on/transcript-off doesn't exist without files.


function sc_Struct(name) {
    this['sc_struct name'] = name;
}
sc_Struct.prototype.sc_toDisplayString = function() {
    return "#<struct" + sc_hash(this) + ">";
};
sc_Struct.prototype.sc_toWriteString = sc_Struct.prototype.sc_toDisplayString;

/*** META ((export #t) (arity #t)
           (peephole (hole 1 "new sc_Struct(" name ")")))
*/
function sc_makeStruct(name) {
    return new sc_Struct(name);
}

/*** META ((export #t) (arity 1)
           (type bool)
           (peephole (safe-postfix " instanceof sc_Struct")))
*/
function sc_isStruct(o) {
    return (o instanceof sc_Struct);
}

/*** META ((export #t) (arity #t)
           (type bool)
           (peephole (safe-hole 2 "(" 1 " instanceof sc_Struct) && ( " 1 "['sc_struct name'] === " 0 ")")))
*/
function sc_isStructNamed(name, s) {
    return ((s instanceof sc_Struct) && (s['sc_struct name'] === name));
}

/*** META ((export struct-field) (arity #t)
           (peephole (hole 3 0 "[" 2 "]")))
*/
function sc_getStructField(s, name, field) {


    return s[field];
}

/*** META ((export struct-field-set!) (arity #t)
           (peephole (hole 4 0 "[" 2 "] = " 3)))
*/
function sc_setStructFieldBang(s, name, field, val) {


    s[field] = val;
}

/*---------------------------------------------------------------------*/
/*    sc_bitNot ...                                                    */
/*---------------------------------------------------------------------*/
/*** META ((export #t) (arity #t)
           (peephole (prefix "~")))
*/
function sc_bitNot(x) {




   var res = ~x;
   







   
   return res;
}

/*---------------------------------------------------------------------*/
/*    sc_bitAnd ...                                                    */
/*---------------------------------------------------------------------*/
/*** META ((export #t) (arity #t)
           (peephole (infix 2 2 "&")))
*/
function sc_bitAnd(x, y) {




   var res = x & y;
   








   return res;
}

/*---------------------------------------------------------------------*/
/*    bit-or ...                                                       */
/*---------------------------------------------------------------------*/
/*** META ((export #t) (arity #t)
           (peephole (infix 2 2 "|")))
*/
function sc_bitOr(x, y) {




   var res = x | y;
   








   return res;
}

/*---------------------------------------------------------------------*/
/*    bit-xor ...                                                      */
/*---------------------------------------------------------------------*/
/*** META ((export #t) (arity #t)
           (peephole (infix 2 2 "^")))
*/
function sc_bitXor(x, y) {




   var res = x ^ y;
   








   return res;
}

/*---------------------------------------------------------------------*/
/*    sc_bitLsh ...                                                    */
/*---------------------------------------------------------------------*/
/*** META ((export #t) (arity #t)
           (peephole (infix 2 2 "<<")))
*/
function sc_bitLsh(x, y) {




   var res = x << y;
   








   return res;
}

/*---------------------------------------------------------------------*/
/*    sc_bitRsh ...                                                    */
/*---------------------------------------------------------------------*/
/*** META ((export #t) (arity #t)
           (peephole (infix 2 2 ">>")))
*/
function sc_bitRsh(x, y) {




   var res = x >> y;
   








   return res;
}

/*---------------------------------------------------------------------*/
/*    sc_bitUrsh ...                                                   */
/*---------------------------------------------------------------------*/
/*** META ((export #t) (arity #t)
           (peephole (infix 2 2 ">>>")))
*/
function sc_bitUrsh(x, y) {




   var res = x >>> y;
   








   return res;
}

/*** META ((export js-field js-property js-ref) (arity #t)
           (peephole (hole 2 o "[" field "]")))
*/
function sc_jsField(o, field) {
    return o[field];
}

/*** META ((export js-field-set! js-property-set! js-set!)
           (arity #t)
           (peephole (hole 3 o "[" field "] = " val)))
*/
function sc_setJsFieldBang(o, field, val) {
    return o[field] = val;
}

/*** META ((export js-field-delete! js-property-delete!)
           (arity #t)
           (peephole (hole 2 "delete " o "[" field "]")))
*/
function sc_deleteJsFieldBang(o, field) {
    delete o[field];
}

/*** META ((export #t)
           (arity -3)
           (peephole (jsCall)))
*/
function sc_jsCall(o, fun) {
    var args = new Array();
    for (var i = 2; i < arguments.length; i++)
	args[i-2] = arguments[i];
    return fun.apply(o, args);
}

/*** META ((export #t)
           (arity -3)
           (peephole (jsMethodCall)))
*/
function sc_jsMethodCall(o, field) {
    var args = new Array();
    for (var i = 2; i < arguments.length; i++)
	args[i-2] = arguments[i];
    return o[field].apply(o, args);
}

/*** META ((export new js-new)
           (arity -2)
           (peephole (jsNew)))
*/
function sc_jsNew(c) {
    var evalStr = "new c(";
    evalStr +=arguments.length > 1? "arguments[1]": "";
    for (var i = 2; i < arguments.length; i++)
	evalStr += ", arguments[" + i + "]";
    evalStr +=")";
    return eval(evalStr);
}    

// ======================== RegExp ====================
/*** META ((export #t) (arity #t)) */
function sc_pregexp(re) {
    return new RegExp(sc_string2jsstring(re));
}

/*** META ((export #t) (arity #t)) */
function sc_pregexpMatch(re, s) {
    var reg = (re instanceof RegExp) ? re : sc_pregexp(re);
    var tmp = reg.exec(sc_string2jsstring(s));
    
    if (tmp == null) return false;
    
    var res = null;
    for (var i = tmp.length-1; i >= 0; i--) {
	if (tmp[i] !== null) {
	    res = sc_cons(sc_jsstring2string(tmp[i]), res);
	} else {
	    res = sc_cons(false, res);
	}
    }
    return res;
}
   
/*** META ((export #t) (arity #t)) */
function sc_pregexpReplace(re, s1, s2) {
   var reg;
   var jss1 = sc_string2jsstring(s1);
   var jss2 = sc_string2jsstring(s2);

   if (re instanceof RegExp) {
       if (re.global)
	   reg = re;
       else
	   reg = new RegExp(re.source);
   } else {
       reg = new RegExp(sc_string2jsstring(re));
   }

   return jss1.replace(reg, jss2);
}
   
/*** META ((export pregexp-replace*) (arity #t)) */
function sc_pregexpReplaceAll(re, s1, s2) {
   var reg;
   var jss1 = sc_string2jsstring(s1);
   var jss2 = sc_string2jsstring(s2);

   if (re instanceof RegExp) {
      if (re.global)
	  reg = re;
      else
	  reg = new RegExp(re.source, "g");
   } else {
       reg = new RegExp(sc_string2jsstring(re), "g");
   }

   return jss1.replace(reg, jss2);
}

/*** META ((export #t) (arity #t)) */
function sc_pregexpSplit(re, s) {
   var reg = ((re instanceof RegExp) ?
	      re :
	      new RegExp(sc_string2jsstring(re)));
   var jss = sc_string2jsstring(s);
   var tmp = jss.split(reg);

   if (tmp == null) return false;

   return sc_vector2list(tmp);
}
   
function sc_pregexpCreateCharsetMatcher(set) {
    if (set.length === 0 || set.length === 1) return new RegExp("[" + set + "]");
    var res = "[";
    for (var i = 0; i < set.length; i++) {
	var c = set.charAt(i);
	if (c === "]")
	    res += "\\]";
	else if (c === "^")
	    res += "\\^";
	else if (c === "\\")
	    res += "\\\\";
	else if (c === "-")
	    res += "\\-";
	else res += c;
    }
    return new RegExp(res + "]");
}

/* =========================================================================== */
/* Other library stuff */
/* =========================================================================== */

/*** META ((export #t) (arity #t)
           (peephole (hole 1 "Math.floor(Math.random()*" 'n ")")))
*/
function sc_random(n) {
    return Math.floor(Math.random()*n);
}

/*** META ((export current-date) (arity #t)
           (peephole (hole 0 "new Date()")))
*/
function sc_currentDate() {
   return new Date();
}

/*** META ((export date->string) (arity #t))
*/
function sc_date2jsstring(d) {
   return sc_string2jsstring( d.toString() );
}

/*** META ((export current-seconds) (arity #t)) 
*/
function sc_currentSeconds() {
   return Math.round((new Date()).getTime() / 1000);
}

/*** META ((export current-microseconds) (arity #t)) 
*/
function sc_currentMicroseconds() {
   return (new Date()).getTime();
}

/*** META ((export #t) (arity #t)) 
*/
function sc_time(proc) {
   var start = sc_currentMicroseconds();
   var res = proc();
   var stop = sc_currentMicroseconds();

   return sc_values( res, stop - start, 0, 0 );
}

function sc_Hashtable() {
}
sc_Hashtable.prototype.toString = function() {
    return "#{%hashtable}";
};
// sc_toWriteString == sc_toDisplayString == toString

function sc_HashtableElement(key, val) {
    this.key = key;
    this.val = val;
}

// the arity of make-hashtable inside Bigloo is -1. However we don't use it
// here. So for now simply don't give the arity...
/*** META ((export #t)
           (peephole (hole 0 "new sc_Hashtable()")))
*/
function sc_makeHashtable() {
    return new sc_Hashtable();
}

/*** META ((export #t) (arity #t)
           (type bool)) */
function sc_isHashtable(o) {
    return o instanceof sc_Hashtable;
}

/*** META ((export #t) (arity #t)) */
function sc_hashtableSize(ht) {


    var count = 0
    for (var hash in ht) {
	if (ht[hash] instanceof sc_HashtableElement)
	    count++;
    }
    return count;
}

/*** META ((export #t) (arity #t)) */
function sc_hashtablePutBang(ht, key, val) {


    var hash = sc_hash(key);
    ht[hash] = new sc_HashtableElement(key, val);
}

/*** META ((export #t) (arity #t)) */
function sc_hashtableGet(ht, key) {


    var hash = sc_hash(key);
    if (hash in ht)
	return ht[hash].val;
    else
	return false;
}

/*** META ((export #t) (arity #t)) */
function sc_hashtableRemoveBang(ht, key) {


    var hash = sc_hash(key);
    if (hash in ht) {
	delete ht[hash];
	return true;
    }
    else
	return false;
}

/*** META ((export #t) (arity #t)) */
function sc_hashtableForEach(ht, f) {


    for (var v in ht) {
	if (ht[v] instanceof sc_HashtableElement)
	    f(ht[v].key, ht[v].val);
    }
}


/*** META ((export #t) (arity #t)) */
function sc_hashtableMap(ht, f) {


   var hd = sc_cons( null, null );
   var res = hd;
   
   for (var v in ht) {
      if (ht[v] instanceof sc_HashtableElement) {
	 res.__hop_cdr = sc_cons( f(ht[v].key, ht[v].val), null );
	 res = res.__hop_cdr;
      }
   }

   return hd.__hop_cdr;
}

/*** META ((export #t) (arity #t)) */
function sc_hashtableKeyList(ht) {


   var hd = sc_cons( null, null );
   var res = hd;
   
   for (var v in ht) {
      if (ht[v] instanceof sc_HashtableElement) {
	 res.__hop_cdr = sc_cons( ht[v].key, null );
	 res = res.__hop_cdr;
      }
   }

   return hd.__hop_cdr;
}

/*** META ((export #t) (arity #t)) */
function sc_hashtable2list(ht) {


   var hd = sc_cons( null, null );
   var res = hd;
   
   for (var v in ht) {
      if (ht[v] instanceof sc_HashtableElement) {
	 res.__hop_cdr = sc_cons( ht[v].val, null );
	 res = res.__hop_cdr;
      }
   }

   return hd.__hop_cdr;
}

/*** META ((export #t) (arity #t)) */
function sc_hashtable2vector(ht) {


   var res = sc_vector(sc_hashtableSize(ht));
   var i = 0;
   
   for (var v in ht) {
      if (ht[v] instanceof sc_HashtableElement) {
	 res[i++]=ht[v].val;
      }
   }

   return res;
}

/*** META ((export hashtable-contains?)
           (arity #t)
           (peephole (hole 2 "sc_hash(" 1 ") in " 0)))
*/
function sc_hashtableContains(ht, key) {


    var hash = sc_hash(key);
    if (hash in ht)
	return true;
    else
	return false;
}

var SC_HASH_COUNTER = 0;

function sc_hash(o) {
    if (o === null)
	return "null";
    else if (o === undefined)
	return "undefined";
    else if (o === true)
	return "true";
    else if (o === false)
	return "false";
    else if (typeof o === "number")
	return "num-" + o;
    else if (typeof o === "string")
	return "jsstr-" + o;
    else if (o.sc_getHash)
	return o.sc_getHash();
    else
	return sc_counterHash.call(o);
}
function sc_counterHash() {
    if (!this.sc_hash) {
	this.sc_hash = "hash-" + SC_HASH_COUNTER;
	SC_HASH_COUNTER++;
    }
    return this.sc_hash;
}

function sc_Trampoline() {
}

sc_Trampoline.prototype.restart = function() {
    while (true) {
	this.calls = this.MAX_TAIL_CALLs-1;
	var res = this.f.apply(this, this.args);
	if (res !== this)
	    return res;
    }
}

/*** META ((export bind-exit-lambda) (arity #t)) */
function sc_bindExitLambda(proc) {
    var escape_obj = new sc_BindExitException();
    var escape = function(res) {
	escape_obj.res = res;
	throw escape_obj;
    };
    try {
	return proc(escape);
    } catch(e) {
	if (e === escape_obj) {
	    return e.res;
	}
	throw e;
    }
}
function sc_BindExitException() {
    this._internalException = true;
}

/*** META ((export unwind-protect-lambda) (arity #t)) */
function sc_unwindProtectLambda(proc1, proc2) {
   try {
      return proc1();
   } finally {
      proc2();
   }
}

var SC_SCM2JS_GLOBALS = new Object();

var SC_TAIL_OBJECT = new sc_Trampoline();  // (used in runtime_callcc.)
SC_SCM2JS_GLOBALS.TAIL_OBJECT = SC_TAIL_OBJECT;

/*---------------------------------------------------------------------*/
/*    OO layer                                                         */
/*---------------------------------------------------------------------*/
var sc_allClasses = {};

function sc_Class() {
   ;
}

/*** META ((export #t)) */
function sc_Object() {
}

sc_Class.prototype.toString = function() {
   return "#<class:" + sc_symbol2jsstring( sc_class_name( this ) ) + ">";
}
sc_Class.prototype.sc_toWriteOrDisplayString = sc_Class.prototype.toString;

sc_Object.prototype.toString = function() {
   var clazz = sc_object_class( this );
   var res = "#|" + sc_symbol2jsstring( clazz.sc_name );

   if( sc_isNil( this ) ) {
      return res + " nil|"
   } else {
      var fields = sc_class_all_fields( clazz );

      for( var i = 0; i < fields.length; i++ ) {
	 res += " ["
	    + sc_symbol2jsstring( fields[ i ].sc_name )
	    + ": "
	    + fields[ i ].sc_getter( this )
	    + "]";
      }
      
      return res + "|";
   }
}

function sc_register_class( clazz, name, zuper, hash, allocator, constructor, fields ) {
   var ftable = {};

   clazz.toString = sc_Class.prototype.toString;
   clazz.toWriteOrDisplayString = sc_Class.prototype.toString;
   clazz.sc_name = name;
   clazz.sc_super = zuper;
   clazz.sc_hash = hash;
   clazz.sc_constructor = constructor;
   clazz.sc_fields = fields;
   clazz.sc_fields_table = ftable;
   clazz.sc_allocator = allocator;

   for( var i = 0; i < fields.length; i++ ) {
      var f = fields[ i ];
      
      ftable[ f.sc_name ] = f;
   }

   if( zuper != clazz ) {
      var constr = ("prototype" in clazz) ? clazz.prototype.constructor
	  : function( c ) { return c; };
      
      clazz.prototype = sc_class_creator( zuper );
      clazz.prototype.constructor = constr;

      for( f in zuper.sc_fields_table ) {
	 ftable[ zuper.sc_fields_table[ f ].sc_name ] = zuper.sc_fields_table[ f ];
      }
      
      clazz.sc_all_fields = sc_vectorAppend( zuper.sc_all_fields, fields );
   } else {
      clazz.sc_all_fields = fields;
   }

   sc_allClasses[ name ] = clazz;

   return clazz;
}

/*** META ((export #t) (arity #t) (type bool)) */
function sc_isClass( o ) {
   return (o.toString === sc_Class.prototype.toString);
}

/*** META ((export #t) (arity #t)) */
function sc_class_exists( cname ) {
   if( cname in sc_allClasses ) {
      return sc_allClasses[ cname ];
   } else {
      return false;
   }
}

/*** META ((export #t) (arity #t)) */
function sc_find_class( cname ) {
   var c = sc_class_exists( cname );

   if( c ) {
      return c;
   } else {
      sc_error( "find-class", "Can't find class", cname );
   }
}

/*** META ((export #t) (arity #t)) */
function sc_class_nil( clazz ) {
   if( !clazz.sc_nil ) clazz.sc_nil = clazz.sc_allocator();
   
   return clazz.sc_nil;
}
   
/*** META ((export #t) (arity #t)) */
function sc_class_name( clazz ) {


   return clazz.sc_name;
}

/*** META ((export #t) (arity #t)) */
function sc_class_super( clazz ) {
   return clazz.sc_super;
}
   
/*** META ((export #t) (arity #t)) */
function sc_class_hash( clazz ) {
   return clazz.sc_hash;
}

/*** META ((export #t) (arity #t)) */
function sc_class_allocator( clazz ) {
   return clazz.sc_allocator;
}

/*** META ((export #t) (arity #t)) */
function sc_class_creator( clazz ) {
   return function() {
      var o =  clazz.sc_allocator();
      var f = sc_class_all_fields( clazz );

      for( i = 0; i < f.length; i++ ) {
	 o[ sc_symbol2jsstring( f[ i ].sc_name ) ] = arguments[ i ];
      }

      return o;
   }
}

/*** META ((export #t) (arity #t)) */
function sc_isA( o, c ) {
   return o instanceof c.allocator;
}

/*** META ((export #t) (arity #t)) */
function sc_isNil( o ) {
   var clazz = sc_object_class( o );
   return sc_class_nil( clazz ) === o;
}

function sc_Field( name, getter, setter, ronly, virtual, info, def, type ) {
   this.sc_name = name;
   this.sc_getter = getter;
   this.sc_setter = setter;
   this.sc_ronly = ronly;
   this.sc_virtual = virtual;
   this.sc_info = info;
   this.sc_def = def;
   this.sc_type = type;
}

function sc_getprototype( o ) {
   if( o instanceof sc_Object ) {
      if( "__proto__" in o ) {
	 return o.__proto__;
      } else {
	 return Object.GetPrototypeOf( o );
      }
   } else {
      return false;
   }
}

/*** META ((export #t) (arity #t)) */
function sc_object_class( o ) {
   var proto = sc_getprototype( o );

   if( proto ) {
      return proto.constructor;
   } else {
      return sc_Object;
   }
}

/*** META ((export #t) (arity #t)) */
function sc_class_fields( clazz ) {


   return clazz.sc_fields;
}

/*** META ((export #t) (arity #t)) */
function sc_class_all_fields( clazz ) {


   return clazz.sc_all_fields;
}

/*** META ((export #t) (arity #t)) */
function sc_find_class_field( clazz, id ) {


   return clazz.sc_fields_table[ id ];
}

/*** META ((export #t) (arity #t)) */
function sc_class_field_name( field ) {
   return field.sc_name;
}

/*** META ((export #t) (arity #t)) */
function sc_class_field_default_value( field ) {
   return field.sc_def();
}

function sc_add_method( clazz, generic, proc ) {
   var name = sc_symbol2jsstring( generic );

   if( !clazz ) {
      Object.prototype[ name ] = proc;
   } else {
      clazz.prototype[ name ] = proc;
   }
}

/*** META ((export #t) (arity #t)) */
function sc_class_field_accessor( field ) {
   return field.sc_getter;
}

/*** META ((export #t) (arity #t)) */
function sc_class_field_mutator( field ) {
   return field.sc_setter;
}

/* OO bootstrap in mutable.js and immutable.js */
/*=====================================================================*/
/*    Author      :  Florian Loitsch                                   */
/*    Copyright   :  2007-15 Florian Loitsch, see LICENSE file         */
/*    -------------------------------------------------------------    */
/*    This file is part of Scheme2Js.                                  */
/*                                                                     */
/*   Scheme2Js is distributed in the hope that it will be useful,      */
/*   but WITHOUT ANY WARRANTY; without even the implied warranty of    */
/*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the     */
/*   LICENSE file for more details.                                    */
/*=====================================================================*/

// ======================== I/O =======================

/*------------------------------------------------------------------*/

function sc_EOF() {
}
var SC_EOF_OBJECT = new sc_EOF();

function sc_Port() {
}

/* --------------- Input ports -------------------------------------*/

function sc_InputPort() {
}
sc_InputPort.prototype = new sc_Port();

sc_InputPort.prototype.peekChar = function() {
    if (!("peeked" in this))
	this.peeked = this.getNextChar();
    return this.peeked;
}
sc_InputPort.prototype.readChar = function() {
    var tmp = this.peekChar();
    delete this.peeked;
    return tmp;
}
sc_InputPort.prototype.isCharReady = function() {
    return true;
}
sc_InputPort.prototype.close = function() {
    // do nothing
}

/* .............. String port ..........................*/
function sc_ErrorInputPort() {
};
sc_ErrorInputPort.prototype = new sc_InputPort();
sc_ErrorInputPort.prototype.getNextChar = function() {
    throw "can't read from error-port.";
};
sc_ErrorInputPort.prototype.isCharReady = function() {
    return false;
};
    

/* .............. String port ..........................*/

function sc_StringInputPort(jsStr) {
    // we are going to do some charAts on the str.
    // instead of recreating all the time a String-object, we
    // create one in the beginning. (not sure, if this is really an optim)
    this.str = new String(jsStr);
    this.pos = 0;
}
sc_StringInputPort.prototype = new sc_InputPort();
sc_StringInputPort.prototype.getNextChar = function() {
    if (this.pos >= this.str.length)
	return SC_EOF_OBJECT;
    return this.str.charAt(this.pos++);
};

/* ------------- Read and other lib-funs  -------------------------------*/
function sc_Token(type, val, pos) {
    this.type = type;
    this.val = val;
    this.pos = pos;
}
sc_Token.EOF = 0/*EOF*/;
sc_Token.OPEN_PAR = 1/*OPEN_PAR*/;
sc_Token.CLOSE_PAR = 2/*CLOSE_PAR*/;
sc_Token.OPEN_BRACE = 3/*OPEN_BRACE*/;
sc_Token.CLOSE_BRACE = 4/*CLOSE_BRACE*/;
sc_Token.OPEN_BRACKET = 5/*OPEN_BRACKET*/;
sc_Token.CLOSE_BRACKET = 6/*CLOSE_BRACKET*/;
sc_Token.WHITESPACE = 7/*WHITESPACE*/;
sc_Token.QUOTE = 8/*QUOTE*/;
sc_Token.ID = 9/*ID*/;
sc_Token.DOT = 10/*DOT*/;
sc_Token.STRING = 11/*STRING*/;
sc_Token.NUMBER = 12/*NUMBER*/;
sc_Token.ERROR = 13/*ERROR*/;
sc_Token.VECTOR_BEGIN = 14/*VECTOR_BEGIN*/;
sc_Token.TRUE = 15/*TRUE*/;
sc_Token.FALSE = 16/*FALSE*/;
sc_Token.UNSPECIFIED = 17/*UNSPECIFIED*/;
sc_Token.REFERENCE = 18/*REFERENCE*/;
sc_Token.STORE = 19/*STORE*/;
sc_Token.CHAR = 20/*CHAR*/;

var SC_ID_CLASS = SC_LOWER_CLASS + SC_UPPER_CLASS + "!$%*+-./:<=>?@^_~";
function sc_Tokenizer(port) {
    this.port = port;
}
sc_Tokenizer.prototype.peekToken = function() {
    if (this.peeked)
	return this.peeked;
    var newToken = this.nextToken();
    this.peeked = newToken;
    return newToken;
};
sc_Tokenizer.prototype.readToken = function() {
    var tmp = this.peekToken();
    delete this.peeked;
    return tmp;
};
sc_Tokenizer.prototype.nextToken = function() {
    var port = this.port;
    
    function isNumberChar(c) {
	return (c >= "0" && c <= "9");
    };
    function isIdOrNumberChar(c) {
	return SC_ID_CLASS.indexOf(c) != -1 || // ID-char
	    (c >= "0" && c <= "9");
    }
    function isWhitespace(c) {
	return c === " " || c === "\r" || c === "\n" || c === "\t" || c === "\f";
    };
    function isWhitespaceOrEOF(c) {
	return isWhitespace(c) || c === SC_EOF_OBJECT;
    };

    function readString() {
	res = "";
	while (true) {
	    var c = port.readChar();
	    switch (c) {
	    case '"':
		return new sc_Token(11/*STRING*/, res);
	    case "\\":
		var tmp = port.readChar();
		switch (tmp) {
		case '0': res += "\0"; break;
		case 'a': res += "\a"; break;
		case 'b': res += "\b"; break;
		case 'f': res += "\f"; break;
		case 'n': res += "\n"; break;
		case 'r': res += "\r"; break;
		case 't': res += "\t"; break;
		case 'v': res += "\v"; break;
		case '"': res += '"'; break;
		case '\\': res += '\\'; break;
		case 'x':
		    /* hexa-number */
		    var nb = 0;
		    while (true) {
			var hexC = port.peekChar();
			if (hexC >= '0' && hexC <= '9') {
			    port.readChar();
			    nb = nb * 16 + hexC.charCodeAt(0) - '0'.charCodeAt(0);
			} else if (hexC >= 'a' && hexC <= 'f') {
			    port.readChar();
			    nb = nb * 16 + hexC.charCodeAt(0) - 'a'.charCodeAt(0);
			} else if (hexC >= 'A' && hexC <= 'F') {
			    port.readChar();
			    nb = nb * 16 + hexC.charCodeAt(0) - 'A'.charCodeAt(0);
			} else {
			    // next char isn't part of hex.
			    res += String.fromCharCode(nb);
			    break;
			}
		    }
		    break;
		default:
		    if (tmp === SC_EOF_OBJECT) {
			return new sc_Token(13/*ERROR*/, "unclosed string-literal" + res);
		    }
		    res += tmp;
		}
		break;
	    default:
		if (c === SC_EOF_OBJECT) {
		    return new sc_Token(13/*ERROR*/, "unclosed string-literal" + res);
		}
		res += c;
	    }
	}
    };
    function readIdNumberOrKeyword(firstChar) {
	var res = firstChar;
	while (isIdOrNumberChar(port.peekChar()))
	    res += port.readChar();
	if (isNaN(res)) {
	    if (res.length > 1) {
		colonCode = ':'.charCodeAt(0);
		if (res.charCodeAt(0) == colonCode) {
		    if (res.charCodeAt(1) != colonCode) {
			return new sc_Token(21/*KEYWORD*/, res.substring(1, res.length));
		    }
		} else if (res.charCodeAt(res.length - 1) == colonCode &&
			   res.charCodeAt(res.length - 2) != colonCode) {
		    return new sc_Token(21/*KEYWORD*/, res.substring(0, res.length - 1));
		}
	    }
	    return new sc_Token(9/*ID*/, res);
	} else {
	    return new sc_Token(12/*NUMBER*/, res - 0);
	}
    };
    
    function skipWhitespaceAndComments() {
	var done = false;
	while (!done) {
	    done = true;
	    while (isWhitespace(port.peekChar()))
		port.readChar();
	    if (port.peekChar() === ';') {
		port.readChar();
		done = false;
		while (true) {
		    curChar = port.readChar();
		    if (curChar === SC_EOF_OBJECT ||
			curChar === '\n')
			break;
		}
	    }
	}
    };
    
    function readDot() {
	if (isWhitespace(port.peekChar()))
	    return new sc_Token(10/*DOT*/);
	else
	    return readIdNumberOrKeyword(".");
    };

    function readSharp() {
	var c = port.readChar();
	if (isWhitespace(c))
	    return new sc_Token(13/*ERROR*/, "bad #-pattern0.");

	// reference
	if (isNumberChar(c)) {
	    var nb = c - 0;
	    while (isNumberChar(port.peekChar()))
		nb = nb*10 + (port.readChar() - 0);
	    switch (port.readChar()) {
	    case '#':
		return new sc_Token(18/*REFERENCE*/, nb);
	    case '=':
		return new sc_Token(19/*STORE*/, nb);
	    default:
		return new sc_Token(13/*ERROR*/, "bad #-pattern1." + nb);
	    }
	}

	if (c === "(")
	    return new sc_Token(14/*VECTOR_BEGIN*/);
	
	if (c === "\\") { // character
	    var tmp = ""
	    while (!isWhitespaceOrEOF(port.peekChar()))
		tmp += port.readChar();
	    switch (tmp.length) {
	    case 0: // it's escaping a whitespace char:
		if (sc_isEOFObject(port.peekChar))
		    return new sc_Token(13/*ERROR*/, "bad #-pattern2.");
		else
		    return new sc_Token(20/*CHAR*/, port.readChar());
	    case 1:
		return new sc_Token(20/*CHAR*/, tmp);
	    default:
		var entry = sc_Char.readable2char[tmp.toLowerCase()];
		if (entry)
		    return new sc_Token(20/*CHAR*/, entry);
		else
		    return new sc_Token(13/*ERROR*/, "unknown character description: #\\" + tmp);
	    }
	}

	// some constants (#t, #f, #unspecified)
	var res;
	var needing;
	switch (c) {
	case 't': res = new sc_Token(15/*TRUE*/, true); needing = ""; break;
	case 'f': res = new sc_Token(16/*FALSE*/, false); needing = ""; break;
	case 'u': res = new sc_Token(17/*UNSPECIFIED*/, undefined); needing = "nspecified"; break;
	default:
	    return new sc_Token(13/*ERROR*/, "bad #-pattern3: " + c);
	}
	while(true) {
	    c = port.peekChar();
	    if ((isWhitespaceOrEOF(c) || c === ')') &&
		needing == "")
		return res;
	    else if (isWhitespace(c) || needing == "")
		return new sc_Token(13/*ERROR*/, "bad #-pattern4 " + c + " " + needing);
	    else if (needing.charAt(0) == c) {
		port.readChar(); // consume
		needing = needing.slice(1);
	    } else
		return new sc_Token(13/*ERROR*/, "bad #-pattern5");
	}
	
    };

    skipWhitespaceAndComments();
    var curChar = port.readChar();
    if (curChar === SC_EOF_OBJECT)
	return new sc_Token(0/*EOF*/, curChar);
    switch (curChar)
    {
    case " ":
    case "\n":
    case "\t":
	return readWhitespace();
    case "(":
	return new sc_Token(1/*OPEN_PAR*/);
    case ")":
	return new sc_Token(2/*CLOSE_PAR*/);
    case "{":
	return new sc_Token(3/*OPEN_BRACE*/);
    case "}":
	return new sc_Token(4/*CLOSE_BRACE*/);
    case "[":
	return new sc_Token(5/*OPEN_BRACKET*/);
    case "]":
	return new sc_Token(6/*CLOSE_BRACKET*/);
    case "'":
	return new sc_Token(8/*QUOTE*/);
    case "#":
	return readSharp();
    case ".":
	return readDot();
    case '"':
	return readString();
    default:
	if (isIdOrNumberChar(curChar))
	    return readIdNumberOrKeyword(curChar);
	throw "unexpected character: " + curChar;
    }
};

function sc_Reader(tokenizer) {
    this.tokenizer = tokenizer;
    this.backref = new Array();
}
sc_Reader.prototype.read = function() {
    function readList(listBeginType) {
	function matchesPeer(open, close) {
	    return open === 1/*OPEN_PAR*/ && close === 2/*CLOSE_PAR*/
	    	|| open === 3/*OPEN_BRACE*/ && close === 4/*CLOSE_BRACE*/
		|| open === 5/*OPEN_BRACKET*/ && close === 6/*CLOSE_BRACKET*/;
	};
	var res = null;

	while (true) {
	    var token = tokenizer.peekToken();
	    
	    switch (token.type) {
	    case 2/*CLOSE_PAR*/:
	    case 4/*CLOSE_BRACE*/:
	    case 6/*CLOSE_BRACKET*/:
		if (matchesPeer(listBeginType, token.type)) {
		    tokenizer.readToken(); // consume token
		    return sc_reverseBang(res);
		} else
		    throw "closing par doesn't match: " + listBeginType
			+ " " + listEndType;

	    case 0/*EOF*/:
		throw "unexpected end of file";

	    case 10/*DOT*/:
		tokenizer.readToken(); // consume token
		var cdr = this.read();
		var par = tokenizer.readToken();
		if (!matchesPeer(listBeginType, par.type))
		    throw "closing par doesn't match: " + listBeginType
			+ " " + par.type;
		else
		    return sc_reverseAppendBang(res, cdr);
		

	    default:
		res = sc_cons(this.read(), res);
	    }
	}
    };
    function readQuote() {
	return sc_cons("quote", sc_cons(this.read(), null));
    };
    function readVector() {
	// opening-parenthesis is already consumed
	var a = new Array();
	while (true) {
	    var token = tokenizer.peekToken();
	    switch (token.type) {
	    case 2/*CLOSE_PAR*/:
		tokenizer.readToken();
		return a;
		
	    default:
		a.push(this.read());
	    }
	}
    };

    function storeRefence(nb) {
	var tmp = this.read();
	this.backref[nb] = tmp;
	return tmp;
    };
	
    function readReference(nb) {
	if (nb in this.backref)
	    return this.backref[nb];
	else
	    throw "bad reference: " + nb;
    };
    
    var tokenizer = this.tokenizer;

    var token = tokenizer.readToken();

    // handle error
    if (token.type === 13/*ERROR*/)
	throw token.val;
    
    switch (token.type) {
    case 1/*OPEN_PAR*/:
    case 3/*OPEN_BRACE*/:
    case 5/*OPEN_BRACKET*/:
	return readList.call(this, token.type);
    case 8/*QUOTE*/:
	return readQuote.call(this);
    case 11/*STRING*/:
	return sc_jsstring2string(token.val);
    case 20/*CHAR*/:
	return new sc_Char(token.val);
    case 14/*VECTOR_BEGIN*/:
	return readVector.call(this);
    case 18/*REFERENCE*/:
	return readReference.call(this, token.val);
    case 19/*STORE*/:
	return storeRefence.call(this, token.val);
    case 9/*ID*/:
	return sc_jsstring2symbol(token.val);
    case 21/*KEYWORD*/:
	return sc_jsstring2keyword(token.val);
    case 0/*EOF*/:
    case 12/*NUMBER*/:
    case 15/*TRUE*/:
    case 16/*FALSE*/:
    case 17/*UNSPECIFIED*/:
	return token.val;
    default:
	throw "unexpected token " + token.type + " " + token.val;
    }
};

/*** META ((export #t) (arity -1)) */
function sc_read(port) {
    if (port === undefined) // we assume the port hasn't been given.
	port = SC_DEFAULT_IN; // THREAD: shared var...
    var reader = new sc_Reader(new sc_Tokenizer(port));
    return reader.read();
}
/*** META ((export #t) (arity -1)) */
function sc_readChar(port) {
    if (port === undefined) // we assume the port hasn't been given.
	port = SC_DEFAULT_IN; // THREAD: shared var...
    var t = port.readChar();
    return t === SC_EOF_OBJECT? t: new sc_Char(t);
}
/*** META ((export #t) (arity -1)) */
function sc_peekChar(port) {
    if (port === undefined) // we assume the port hasn't been given.
	port = SC_DEFAULT_IN; // THREAD: shared var...
    var t = port.peekChar();
    return t === SC_EOF_OBJECT? t: new sc_Char(t);
}    
/*** META ((export #t)
           (arity -1)
           (type bool))
*/
function sc_isCharReady(port) {
    if (port === undefined) // we assume the port hasn't been given.
	port = SC_DEFAULT_IN; // THREAD: shared var...
    return port.isCharReady();
}
/*** META ((export #t)
           (arity #t)
           (peephole (postfix ".close()")))
*/
function sc_closeInputPort(p) {
    return p.close();
}

/*** META ((export #t)
           (arity #t)
           (type bool)
           (peephole (postfix " instanceof sc_InputPort")))
*/
function sc_isInputPort(o) {
    return (o instanceof sc_InputPort);
}

/*** META ((export eof-object?)
           (arity #t)
           (type bool)
           (peephole (postfix " === SC_EOF_OBJECT")))
*/
function sc_isEOFObject(o) {
    return o === SC_EOF_OBJECT;
}

/*** META ((export #t)
           (arity #t)
           (peephole (hole 0 "SC_DEFAULT_IN")))
*/
function sc_currentInputPort() {
    return SC_DEFAULT_IN;
}

/* ------------ file operations are not supported -----------*/
/*** META ((export #t) (arity #t)) */
function sc_callWithInputFile(s, proc) {
    throw "can't open " + s;
}

/*** META ((export #t) (arity #t)) */
function sc_callWithOutputFile(s, proc) {
    throw "can't open " + s;
}

/*** META ((export #t) (arity #t)) */
function sc_withInputFromFile(s, thunk) {
    throw "can't open " + s;
}

/*** META ((export #t) (arity #t)) */
function sc_withOutputToFile(s, thunk) {
    throw "can't open " + s;
}

/*** META ((export #t) (arity #t)) */
function sc_openInputFile(s) {
    throw "can't open " + s;
}

/*** META ((export #t) (arity #t)) */
function sc_openOutputFile(s) {
    throw "can't open " + s;
}

/* ----------------------------------------------------------------------------*/
/*** META ((export #t) (arity #t)) */
function sc_basename(p) {
   var i = p.lastIndexOf('/');

   if(i >= 0)
      return p.substring(i + 1, p.length);
   else
      return p;
}

/*** META ((export #t) (arity #t)) */
function sc_dirname(p) {
   var i = p.lastIndexOf('/');

   if(i >= 0)
      return p.substring(0, i);
   else
      return '';
}

/* ----------------------------------------------------------------------------*/

/*** META ((export #t) (arity #t)) */
function sc_withInputFromPort(p, thunk) {
    try {
	var tmp = SC_DEFAULT_IN; // THREAD: shared var.
	SC_DEFAULT_IN = p;
	return thunk();
    } finally {
	SC_DEFAULT_IN = tmp;
    }
}

/*** META ((export #t) (arity #t)) */
function sc_withInputFromString(s, thunk) {
    return sc_withInputFromPort(new sc_StringInputPort(sc_string2jsstring(s)), thunk);
}

/*** META ((export #t) (arity #t)) */
function sc_withOutputToPort(p, thunk) {
    try {
	var tmp = SC_DEFAULT_OUT; // THREAD: shared var.
	SC_DEFAULT_OUT = p;
	return thunk();
    } finally {
	SC_DEFAULT_OUT = tmp;
    }
}

/*** META ((export #t) (arity #t)) */
function sc_withOutputToString(thunk) {
    var p = new sc_StringOutputPort();
    sc_withOutputToPort(p, thunk);
    return p.close();
}

/*** META ((export #t) (arity #t)) */
function sc_withOutputToProcedure(proc, thunk) {
    var t = function(s) { proc(sc_jsstring2string(s)); };
    return sc_withOutputToPort(new sc_GenericOutputPort(t), thunk);
}

/*** META ((export #t)
           (arity #t)           
           (peephole (hole 0 "new sc_StringOutputPort()")))
*/
function sc_openOutputString() {
    return new sc_StringOutputPort();
}

/*** META ((export #t) (arity #t)) */
function sc_openInputString(str) {
    return new sc_StringInputPort(sc_string2jsstring(str));
}

/* ----------------------------------------------------------------------------*/

function sc_OutputPort() {
}
sc_OutputPort.prototype = new sc_Port();
sc_OutputPort.prototype.appendJSString = function(obj) {
    /* do nothing */
}
sc_OutputPort.prototype.close = function() {
    /* do nothing */
}

function sc_StringOutputPort() {
    this.res = "";
}
sc_StringOutputPort.prototype = new sc_OutputPort();
sc_StringOutputPort.prototype.appendJSString = function(s) {
    this.res += s;
}
sc_StringOutputPort.prototype.close = function() {
    return sc_jsstring2string(this.res);
}

/*** META ((export #t) (arity #t)) */
function sc_getOutputString(sp) {
    return sc_jsstring2string(sp.res);
}
    

function sc_ErrorOutputPort() {
}
sc_ErrorOutputPort.prototype = new sc_OutputPort();
sc_ErrorOutputPort.prototype.appendJSString = function(s) {
   console.log( s );
    //throw "don't write on ErrorPort!";
}
sc_ErrorOutputPort.prototype.close = function() {
    /* do nothing */
}

function sc_GenericOutputPort(appendJSString, close) {
    this.appendJSString = appendJSString;
    if (close)
	this.close = close;
}
sc_GenericOutputPort.prototype = new sc_OutputPort();

/*** META ((export #t)
           (arity #t)
	   (type bool)
           (peephole (postfix " instanceof sc_OutputPort")))
*/
function sc_isOutputPort(o) {
    return (o instanceof sc_OutputPort);
}

/*** META ((export #t)
           (arity #t)
           (peephole (postfix ".close()")))
*/
function sc_closeOutputPort(p) {
    return p.close();
}

/* ------------------ write ---------------------------------------------------*/

/*** META ((export #t) (arity -2)) */
function sc_write(o, p) {
    if (p === undefined) // we assume not given
	p = SC_DEFAULT_OUT;
    p.appendJSString(sc_toWriteString(o));
}

function sc_toWriteStringProcedure(o) {
   if ("sc_name" in o) {
      return "#<procedure " + o.displayName + " " + (o.sc_location != "#f" ? o.sc_location : "") + ":" + sc_hash(o) + ">";
   } else {
      var n = o.toString().match( /function[ \t\n]+([_a-zA-Z0-9$]+)/ );
      
      return "#<procedure " + (n ? n[ 1 ] : "anonymous") + ":" + sc_hash(o) + ">";
   }
}

function sc_toWriteString(o) {
   if (o === null)
      return "()";
   if (o === true)
      return "#t";
   if (o === false)
      return "#f";
   if (o === undefined)
      return "#unspecified";
   if (typeof o === 'function' && !("toString" in o) ) {
      sc_toWriteStringProcedure(o);
   }
   if (o.sc_toWriteString)
      return o.sc_toWriteString();
   return o.toString();
}

function sc_escapeWriteString(s) {
    var res = "";
    var j = 0;
    for (i = 0; i < s.length; i++) {
	switch (s.charAt(i)) {
	case "\0": res += s.substring(j, i) + "\\0"; j = i + 1; break;
	case "\b": res += s.substring(j, i) + "\\b"; j = i + 1; break;
	case "\f": res += s.substring(j, i) + "\\f"; j = i + 1; break;
	case "\n": res += s.substring(j, i) + "\\n"; j = i + 1; break;
	case "\r": res += s.substring(j, i) + "\\r"; j = i + 1; break;
	case "\t": res += s.substring(j, i) + "\\t"; j = i + 1; break;
	case '"': res += s.substring(j, i) + '\\"'; j = i + 1; break;
	case "\\": res += s.substring(j, i) + "\\\\"; j = i + 1; break;
	default:
	    var c = s.charAt(i);
	    if ("\a" !== "a" && c == "\a") {
		res += s.substring(j, i) + "\\a"; j = i + 1; continue;
	    }
	    if ("\v" !== "v" && c == "\v") {
		res += s.substring(j, i) + "\\v"; j = i + 1; continue;
	    }
	    //if (s.charAt(i) < ' ' || s.charCodeAt(i) > 127) {
	    // CARE: Manuel is this OK with HOP?
	    if (s.charAt(i) < ' ') {
		/* non printable character and special chars */
		res += s.substring(j, i) + "\\x" + s.charCodeAt(i).toString(16);
		j = i + 1;
	    }
	    // else just let i increase...
	}
    }
    res += s.substring(j, i);
    return res;
}

/* ------------------ display ---------------------------------------------------*/

/*** META ((export #t) (arity -2)) */
function sc_display(o, p) {
    if (p === undefined) // we assume not given
	p = SC_DEFAULT_OUT;
    p.appendJSString(sc_toDisplayString(o));
}

function sc_toDisplayString(o) {
   if (o === null)
      return "()";
   else if (o === true)
      return "#t";
   else if (o === false)
      return "#f";
   else if (o === undefined)
      return "#unspecified";
    // window is only declared inside browsers. Otherwise this.window should be undefined
   else if (typeof o === 'function' && !("toString" in o) )
      return sc_toWriteStringProcedure(o);
   else if (o.sc_toDisplayString)
      return o.sc_toDisplayString();
   //else if ((this != undefined) && ("window" in this) && (o === this.window))
    //  return "window";
   else
      return o.toString();
}

/* ------------------ newline ---------------------------------------------------*/

/*** META ((export #t) (arity -1)) */
function sc_newline(p) {
    if (p === undefined) // we assume not given
	p = SC_DEFAULT_OUT;
    p.appendJSString("\n");
}
    
/* ------------------ write-char ---------------------------------------------------*/

/*** META ((export #t) (arity -2)) */
function sc_writeChar(c, p) {
    if (p === undefined) // we assume not given
	p = SC_DEFAULT_OUT;
    p.appendJSString(c.val);
}

/* ------------------ write/display-circle -----------------------------------------*/

/*** META ((export #t) (arity -2)) */
function sc_writeCircle(o, p) {
    if (p === undefined) // we assume not given
	p = SC_DEFAULT_OUT;
    p.appendJSString(sc_toCircleString(o, sc_toWriteString));
}

/*** META ((export #t) (arity -2)) */
function sc_displayCircle(o, p) {
    if (p === undefined) // we assume not given
	p = SC_DEFAULT_OUT;
    p.appendJSString(sc_toCircleString(o, sc_toDisplayString));
}

function sc_toCircleString(o, writeOrDisplay) {
    var symb = sc_gensym("writeCircle");
    var nbPointer = new Object();
    nbPointer.nb = 0;
    sc_prepCircle(o, symb, nbPointer);
    return sc_genToCircleString(o, symb, writeOrDisplay);
}

function sc_prepCircle(o, symb, nbPointer) {
    // TODO sc_Struct
    if (o instanceof sc_Pair ||
	o instanceof sc_Vector) {
	if (o[symb] !== undefined) {
	    // not the first visit.
	    o[symb]++;
	    // unless there is already a number, assign one.
	    if (!o[symb + "nb"]) o[symb + "nb"] = nbPointer.nb++;
	    return;
	}
	o[symb] = 0;
	if (o instanceof sc_Pair) {
	    sc_prepCircle(o.__hop_car, symb, nbPointer);
	    sc_prepCircle(o.__hop_cdr, symb, nbPointer);
	} else {
	    for (var i = 0; i < o.length; i++)
		sc_prepCircle(o[i], symb, nbPointer);
	}
    }
}

function sc_genToCircleString(o, symb, writeOrDisplay) {
    if (!(o instanceof sc_Pair ||
	  o instanceof sc_Vector))
	return writeOrDisplay(o);
    return o.sc_toCircleString(symb, writeOrDisplay);
}
sc_Pair.prototype.sc_toCircleString = function(symb, writeOrDisplay, inList) {
    if (this[symb + "use"]) { // use-flag is set. Just use it.
	var nb = this[symb + "nb"];
	if (this[symb]-- === 0) { // if we are the last use. remove all fields.
	    delete this[symb];
	    delete this[symb + "nb"];
	    delete this[symb + "use"];
	}
	if (inList)
	    return '. #' + nb + '#';
	else
	    return '#' + nb + '#';
    }
    if (this[symb]-- === 0) { // if we are the last use. remove all fields.
	delete this[symb];
	delete this[symb + "nb"];
	delete this[symb + "use"];
    }

    var res = "";
    
    if (this[symb] !== undefined) { // implies > 0
	this[symb + "use"] = true;
	if (inList)
	    res += '. #' + this[symb + "nb"] + '=';
	else
	    res += '#' + this[symb + "nb"] + '=';
	inList = false;
    }

    if (!inList)
	res += "(";
    
    // print car
    res += sc_genToCircleString(this.__hop_car, symb, writeOrDisplay);
    
    if (sc_isPair(this.__hop_cdr)) {
	res += " " + this.__hop_cdr.sc_toCircleString(symb, writeOrDisplay, true);
    } else if (this.__hop_cdr !== null) {
	res += " . " + sc_genToCircleString(this.__hop_cdr, symb, writeOrDisplay);
    }
    if (!inList)
	res += ")";
    return res;
};

function sc_VectorToCircleString( symb, writeOrDisplay ) {
   if (this[symb + "use"]) { // use-flag is set. Just use it.
      var nb = this[symb + "nb"];
      if (this[symb]-- === 0) { // if we are the last use. remove all fields.
	 delete this[symb];
	 delete this[symb + "nb"];
	 delete this[symb + "use"];
      }
      return '#' + nb + '#';
   }
   if (this[symb]-- === 0) { // if we are the last use. remove all fields.
      delete this[symb];
      delete this[symb + "nb"];
      delete this[symb + "use"];
   }

   var res = "";
   if (this[symb] !== undefined) { // implies > 0
      this[symb + "use"] = true;
      res += '#' + this[symb + "nb"] + '=';
   }
   res += "#(";
   for (var i = 0; i < this.length; i++) {
      res += sc_genToCircleString(this[i], symb, writeOrDisplay);
      if (i < this.length - 1) res += " ";
    }
   res += ")";
   return res;
}

if( "defineProperty" in Object ) {
   Object.defineProperty( sc_Vector, "sc_toCircleString", {
      value: sc_VectorToCircleString,
      enumerable: false
   } );
} else {
   sc_Vector.prototype.sc_toCircleString = sc_VectorToCircleString;
};

/* ------------------ print ---------------------------------------------------*/

/*** META ((export #t) (arity -1)) */
function sc_print(s) {
    if (arguments.length === 1) {
	sc_display(s);
	sc_newline();
    }
    else {
	for (var i = 0; i < arguments.length; i++)
	    sc_display(arguments[i]);
	sc_newline();
    }
}

/* ------------------ format ---------------------------------------------------*/
/*** META ((export #t) (arity -2)) */
function sc_format(s) {
   var len = s.length;
   var p = new sc_StringOutputPort();
   var i = 0, j = 1;

   function format_num(n,base) {
      switch(base.charCodeAt(0)) {
	  case 68:
	  case 100:
	      // d
	      return n.toString(10);

	  case 88:
	  case 120:
	      // x
	      return n.toString(16);

	  case 79:
	  case 111:
	      // o
	      return n.toString(8);

	  case 66:
	  case 98:
	      // b
	      return n.toString(2);
      }
   }

   function format_number(s, n, p) {
      var m = s.match("([0-9]+),(.)([xXoObBdD])");

      if (m) {
	 var fs = format_num(n,m[3]);
	 var k = parseInt(m[1]);

	 if (fs.length < k) {
	    for (var l=k-fs.length; l> 0; l--)
	       p.appendJSString(m[2]);
	 }

	 p.appendJSString(fs);
	 return m[0].length;
      } else {
	 m = s.match("([0-9]+)([xXoObBdD])");
	 if (m) {
	    var fs = format_num(n,m[2]);
	    var k = parseInt(m[1]);
	    
	    if (fs.length < k) {
	       for (var l=k-fs.length; l> 0; l--)
		  p.appendJSString(" ");
	    }

	    p.appendJSString(fs);
	    return m[0].length;
	 } else {
	    sc_error("format: illegal ~ tag \"" + s + "\"");
	    return 0;
	 }
      }
   }

   function format_list_inner(sep, l, p) {
      if (sc_isPair(l)) {
	 while (true) {
	    format_list_inner(sep, l.__hop_car, p);
	    if (sc_isPair(l.__hop_cdr)) {
	       p.appendJSString(sep);
	       l = l.__hop_cdr;
	    } else {
	       if (l.__hop_cdr != null) {
		  format_list_inner(sep, l.__hop_cdr, p);
	       }
	       break;
	    }
	 }
      } else {
	 sc_display(l, p);
      }
   }
   
   function format_list(sep, l, p) {
      if (sc_isPair(l)) {
	 format_list_inner(sep, l, p);
      } else {
	 sc_display("", p);
      }
   }
	 
   while( i < len ) {
      var i2 = s.indexOf("~", i);

      if (i2 == -1) {
	  p.appendJSString( s.substring(i, len) );
	  return p.close();
      } else if (i2 == (len - 1)) {
	  p.appendJSString(s.substring(i, len));
	  return p.close();
      } else if (i2 == (len - 2) && s.charAt(i2 + 1) == ":") {
	  p.appendJSString(s.substring(i, len));
	  return p.close();
      } else {
	  if (i2 > i) p.appendJSString(s.substring(i, i2));

	  var alternativeForm = (s.charAt(i2 + 1) == ":");
	  if (alternativeForm) i2++;

	  // already advance before evalualating escape sequences.
	  // this way it is easier to see.
	  // no escape sequence requires 'i'.
	  i = i2 + 2;

	  switch(s.charCodeAt(i2 + 1)) {
	  case 65:
	  case 97:
	      // a
	      if (alternativeForm)
		  sc_displayCircle(arguments[j], p);
	      else
		  sc_display(arguments[j], p);
	      j++;
	      break;

	  case 83:
	  case 115:
	      // s
	      if (alternativeForm)
		  sc_writeCircle(arguments[j], p);
	      else
		  sc_write(arguments[j], p);
	      j++;
	      break;

	  case 86:
	  case 118:
	      // v
	      if (alternativeForm)
		  sc_displayCircle(arguments[j], p);
	      else
		  sc_display(arguments[j], p);
	      p.appendJSString("\n");
	      j++;
	      break;

	  case 67:
	  case 99:
	      // c
	      p.appendJSString(String.fromCharCode(arguments[j]));
	      j++;
	      break;

	  case 68:
	  case 100:
	      // d
	      p.appendJSString(arguments[j].toString(10));
	      j++;
	      break;

	  case 88:
	  case 120:
	      // x
	      p.appendJSString(arguments[j].toString(16));
	      j++;
	      break;

	  case 79:
	  case 111:
	      // o
	      p.appendJSString(arguments[j].toString(8));
	      j++;
	      break;

	  case 66:
	  case 98:
	      // b
	      p.appendJSString(arguments[j].toString(2));
	      j++;
	      break;
	       
	  case 37:
	  case 110:
	      // %, n
	      p.appendJSString("\n");
	      break;

	  case 114:
	      // r
	      p.appendJSString("\r");
	      break;

	  case 40:
	      // (
	      var i3 = s.indexOf(")", i2+2);

	      if (i3) {
  	        format_list(s.substring(i2+2,i3),arguments[j++], p);
		i = i3 + 1;
	      } else {
		 i++;
	      }
	      break;

	  case 126:
	      // ~
	      p.appendJSString("~");
	      break;

	  case 48:
	  case 49:
	  case 50:
	  case 51:
	  case 52:
	  case 53:
	  case 54:
	  case 55:
	  case 56:
	  case 57:
	     // char-numeric
	     i += format_number(s.substr(i2 + 1), arguments[j++], p) - 1;
	     break;
	     
	  default:
	      sc_error( "format: illegal ~"
			+ String.fromCharCode(s.charCodeAt(i2 + 1))
			+ " sequence" );
	      return "";
	  }
      }
   }

   return p.close();
}

   
/* ------------------ global ports ---------------------------------------------------*/

var SC_DEFAULT_IN = new sc_ErrorInputPort();
var SC_DEFAULT_OUT = new sc_ErrorOutputPort();
var SC_ERROR_OUT = new sc_ErrorOutputPort();

/*=====================================================================*/
/*    Author      :  Florian Loitsch                                   */
/*    Copyright   :  2007-13 Florian Loitsch, see LICENSE file         */
/*    -------------------------------------------------------------    */
/*    This file is part of Scheme2Js.                                  */
/*                                                                     */
/*   Scheme2Js is distributed in the hope that it will be useful,      */
/*   but WITHOUT ANY WARRANTY; without even the implied warranty of    */
/*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the     */
/*   LICENSE file for more details.                                    */
/*=====================================================================*/

var sc_SYMBOL_PREFIX = "\uEBAC";
var sc_KEYWORD_PREFIX = "\uEBAD";

/*** META ((export #t) (arity #t)
           (peephole (id))) */
function sc_jsstring2string(s) {
    return s;
}

/*** META ((export #t) (arity #t)
           (peephole (prefix "'\\uEBAC' +")))
*/
function sc_jsstring2symbol(s) {
    return sc_SYMBOL_PREFIX + s;
}

/*** META ((export #t) (arity #t)
           (peephole (id)))
*/
function sc_string2jsstring(s) {
    return s;
}

/*** META ((export #t) (arity #t)
           (peephole (symbol2jsstring_immutable)))
*/
function sc_symbol2jsstring(s) {
    return s.slice(1);
}

/*** META ((export #t) (arity #t)
           (peephole (postfix ".slice(1)")))
*/
function sc_keyword2jsstring(k) {
    return k.slice(1);
}

/*** META ((export #t) (arity #t)
           (peephole (prefix "'\\uEBAD' +")))
*/
function sc_jsstring2keyword(s) {
    return sc_KEYWORD_PREFIX + s;
}

/*** META ((export #t)
           (arity #t)
           (type bool))
*/
function sc_isKeyword(s) {
    return (typeof s === "string") &&
	(s.charAt(0) === sc_KEYWORD_PREFIX);
}


/*** META ((export #t) (arity -1)) */
var sc_gensym = function() {
    var counter = 1000;
    return function(sym) {
	counter++;
	if (!sym) sym = sc_SYMBOL_PREFIX;
	return sym + "s" + counter + "~" + "^sC-GeNsYm ";
    };
}();


/*** META ((export #t)
           (arity #t)
           (type bool))
*/
function sc_isEqual(o1, o2) {
    return ((o1 === o2) ||
	    (sc_isPair(o1) && sc_isPair(o2)
	     && sc_isPairEqual(o1, o2, sc_isEqual)) ||
	    (sc_isVector(o1) && sc_isVector(o2)
	     && sc_isVectorEqual(o1, o2, sc_isEqual)) ||
	    (sc_objectEqual(o1, o2)));
}

function sc_objectEqual(x, y) {
  if (!(x instanceof Object) || !(y instanceof Object)) return false;
    // if they are not strictly equal, they both need to be Objects

  if (x.constructor !== y.constructor) return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.

   for (var p in x) {
      if (!x.hasOwnProperty(p)) continue;
      // other properties were tested using x.constructor === y.constructor

      if (!y.hasOwnProperty(p)) return false;
      // allows to compare x[ p ] and y[ p ] when set to undefined

      if (x[p] === y[p]) continue;
      // if they have the same strict value or identity then they are equal

      if (typeof(x[p]) !== "object") return false;
      // Numbers, Strings, Functions, Booleans must be strictly equal

      if ( !sc_isEqual(x[p],y[p])) return false;
      // Objects and Arrays must be tested recursively
   }

   for (var p in y) {
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
      // allows x[ p ] to be set to undefined
   }
   return true;
}

/*** META ((export number->symbol integer->symbol) (arity -2)) */
function sc_number2symbol(x, radix) {
    return sc_SYMBOL_PREFIX + sc_number2jsstring(x, radix);
}
    
/*** META ((export number->string integer->string) (arity -2)) */
var sc_number2string = sc_number2jsstring;

/*** META ((export #t) (arity -2)) */
function sc_symbol2number(s, radix) {
    return sc_jsstring2number(s.slice(1), radix);
}

/*** META ((export #t) (arity -2)) */
var sc_string2number = sc_jsstring2number;

/*** META ((export #t) (arity -2)
           (peephole (hole 2 "parseInt(" s "," radix ")")))
*/
function sc_string2integer(s, radix) {
   return parseInt(s, radix);
}

/*** META ((export #t) (arity #t)
           (peephole (hole 1 "parseFloat(" s ")")))
*/
function sc_string2real(s) {
   return parseFloat(s);
}

/*** META ((export #t)
           (arity #t)
           (type bool))
*/
function sc_isSymbol(s) {
    return (typeof s === "string") &&
	(s.charAt(0) === sc_SYMBOL_PREFIX);
}

/*** META ((export #t)
           (arity #t)
           (peephole (symbol2string_immutable)))
*/
function sc_symbol2string(s) {
    return s.slice(1);
}

/*** META ((export #t)
           (arity #t)
           (peephole (prefix "'\\uEBAC' +")))
*/
function sc_string2symbol(s) {
    return sc_SYMBOL_PREFIX + s;
}

/*** META ((export symbol-append)
           (arity -1)
           (peephole (symbolAppend_immutable)))
*/
function sc_symbolAppend() {
    var res = sc_SYMBOL_PREFIX;
    for (var i = 0; i < arguments.length; i++)
	res += arguments[i].slice(1);
    return res;
}

/*** META ((export #t)
           (arity #t)
           (peephole (postfix ".val")))
*/
function sc_char2string(c) { return c.val; }

/*** META ((export #t)
           (arity #t)
           (peephole (hole 1 "'\\uEBAC' + " c ".val")))
*/
function sc_char2symbol(c) { return sc_SYMBOL_PREFIX + c.val; }

/*** META ((export #t)
           (arity #t)
           (type bool))
*/
function sc_isString(s) {
    return (typeof s === "string") &&
	(s.charAt(0) !== sc_SYMBOL_PREFIX) &&
	(s.charAt(0) !== sc_KEYWORD_PREFIX);
}

/*** META ((export #t)
           (arity #t)
           (type bool)
	   (peephole (postfix "=== \"\"")))
*/
function sc_isStringNull(s) {
   return s === "";
}

/*** META ((export #t) (arity -2)) */
var sc_makeString = sc_makejsString;


/*** META ((export #t) (arity -1)) */
function sc_string() {
    for (var i = 0; i < arguments.length; i++)
	arguments[i] = arguments[i].val;
    return "".concat.apply("", arguments);
}

/*** META ((export #t)
           (arity #t)
           (peephole (postfix ".length")))
*/
function sc_stringLength(s) { return s.length; }

/*** META ((export #t) (arity #t)) */
function sc_stringRef(s, k) {
    return new sc_Char(s.charAt(k));
}

/* there's no stringSet in the immutable version
function sc_stringSet(s, k, c)
*/


/*** META ((export string=?)
           (arity #t)
	   (type bool)
           (peephole (hole 2 str1 " === " str2)))
*/
function sc_isStringEqual(s1, s2) {
    return s1 === s2;
}
/*** META ((export string<?)
           (arity #t)
	   (type bool)
           (peephole (hole 2 str1 " < " str2)))
*/
function sc_isStringLess(s1, s2) {
    return s1 < s2;
}
/*** META ((export string>?)
           (arity #t)
	   (type bool)
           (peephole (hole 2 str1 " > " str2)))
*/
function sc_isStringGreater(s1, s2) {
    return s1 > s2;
}
/*** META ((export string<=?)
           (arity #t)
	   (type bool)
           (peephole (hole 2 str1 " <= " str2)))
*/
function sc_isStringLessEqual(s1, s2) {
    return s1 <= s2;
}
/*** META ((export string>=?)
           (arity #t)
	   (type bool)
           (peephole (hole 2 str1 " >= " str2)))
*/
function sc_isStringGreaterEqual(s1, s2) {
    return s1 >= s2;
}
/*** META ((export string-ci=?)
           (arity #t)
	   (type bool)
           (peephole (hole 2 str1 ".toLowerCase() === " str2 ".toLowerCase()")))
*/
function sc_isStringCIEqual(s1, s2) {
    return s1.toLowerCase() === s2.toLowerCase();
}
/*** META ((export string-ci<?)
           (arity #t)
	   (type bool)
           (peephole (hole 2 str1 ".toLowerCase() < " str2 ".toLowerCase()")))
*/
function sc_isStringCILess(s1, s2) {
    return s1.toLowerCase() < s2.toLowerCase();
}
/*** META ((export string-ci>?)
           (arity #t)
	   (type bool)
           (peephole (hole 2 str1 ".toLowerCase() > " str2 ".toLowerCase()")))
*/
function sc_isStringCIGreater(s1, s2) {
    return s1.toLowerCase() > s2.toLowerCase();
}
/*** META ((export string-ci<=?)
           (arity #t)
	   (type bool)
           (peephole (hole 2 str1 ".toLowerCase() <= " str2 ".toLowerCase()")))
*/
function sc_isStringCILessEqual(s1, s2) {
    return s1.toLowerCase() <= s2.toLowerCase();
}
/*** META ((export string-ci>=?)
           (arity #t)
	   (type bool)
           (peephole (hole 2 str1 ".toLowerCase() >= " str2 ".toLowerCase()")))
*/
function sc_isStringCIGreaterEqual(s1, s2) {
    return s1.toLowerCase() >= s2.toLowerCase();
}

/*** META ((export string-contains)
           (arity -3)
	   (type bool))
*/
function sc_stringContains(s1,s2,start) {
   return s1.indexOf(s2,start ? start : 0) >= 0;
}

/*** META ((export string-contains-ci)
           (arity -3)
	   (type bool))
*/
function sc_stringCIContains(s1,s2,start) {
   return s1.toLowerCase().indexOf(s2.toLowerCase(),start ? start : 0) >= 0;
}

/*** META ((export #t)
           (arity -2))
*/
function sc_substring(s, start, end) {
   return s.substring(start, (end == undefined || end < 0) ? s.length : end);
}

//           (peephole (hole 2 s ".substring(" start ", " s ".length )")))

/*** META ((export #t) (arity -4))
*/
function sc_isSubstring_at(str1, str2, i, len) {
    if (!len) len = str2.length;
    else if (str2.length < len) return false;
    if (str1.length < len + i) return false;
    return str2.substring(0, len) == str1.substring(i, i+len);
}

/*** META ((export substring=?) (arity #t))
*/
function sc_isSubstring(s1, s2, len) {
    if (s1.length < len) return false;
    if (s2.length < len) return false;
    return s2.substring(0, len) == s1.substring(0, len);
}

/*** META ((export #t)
           (arity -1)
           (peephole (infix 0 #f "+" "''")))
*/
function sc_stringAppend() {


    return "".concat.apply("", arguments);
}

/*** META ((export #t) (arity 1)) */
var sc_string2list = sc_jsstring2list;

/*** META ((export #t) (arity 1)) */
var sc_list2string = sc_list2jsstring;

/*** META ((export #t)
           (arity #t)
           (peephole (id)))
*/
function sc_stringCopy(s) {
    return s;
}

/* there's no string-fill in the immutable version
function sc_stringFill(s, c)
*/

/*** META ((export #t)
           (arity #t)
           (peephole (postfix ".slice(1)")))
*/
function sc_keyword2string(o) {
    return o.slice(1);
}

/*** META ((export #t)
           (arity #t)
           (peephole (prefix "'\\uEBAD' +")))
*/
function sc_string2keyword(o) {
    return sc_KEYWORD_PREFIX + o;
}

String.prototype.sc_toDisplayString = function() {
    if (this.charAt(0) === sc_SYMBOL_PREFIX)
	// TODO: care for symbols with spaces (escape-chars symbols).
	return this.slice(1);
    else if (this.charAt(0) === sc_KEYWORD_PREFIX)
	return ":" + this.slice(1);
    else
	return this.toString();
};

String.prototype.sc_toWriteString = function() {
    if (this.charAt(0) === sc_SYMBOL_PREFIX)
	// TODO: care for symbols with spaces (escape-chars symbols).
	return this.slice(1);
    else if (this.charAt(0) === sc_KEYWORD_PREFIX)
	return ":" + this.slice(1);
    else
	return '"' + sc_escapeWriteString(this) + '"';
};

/*** META ((export #t)
           (arity #t)
           (peephole (hole 2 1 ".indexOf(" 0 ") === 0")))
*/
function sc_isStringPrefix(cs1, cs2) {
    return cs2.indexOf(cs1) === 0;
}

/*** META ((export #t) (arity #t)) */
function sc_isStringSuffix(cs1, cs2) {
    var tmp = cs2.lastIndexOf(cs1);
    return tmp !== false && tmp >= 0 && tmp === cs2.length - cs1.length;
}

/*** META ((export #t) (arity -1)) */
function sc_stringSplit(s, sep) {
    if (arguments.length === 1)
       return sc_vector2list(s.split(" "));
    if (sep.length === 1)
	return sc_vector2list(s.split(sep));
    return sc_vector2list(s.split(sc_pregexpCreateCharsetMatcher(sep)));
}

/*** META ((export #t) (arity -3)) */
function sc_stringIndex(s, cset, start) {
   var res;
   if (!start) start = 0;

   if (cset instanceof sc_Char) {
      res = s.indexOf(sc_char2string(cset), start);
      return res >= 0 ? res : false;
   }
   if (cset.length == 1) {
      res = s.indexOf(cset, start);
      return res >= 0 ? res : false;
   } else {
      for (var i = start; i < s.length; i++ ) {
	 if (cset.indexOf(s.charAt(i)) >= 0) {
	    return i;
	 }
      }

      return false;
   }
}

/*** META ((export #t) (arity -3)) */
function sc_stringIndexRight(s, cset, start) {
   var res;
   if (!start) start = s.length - 1;
   
   if (cset instanceof sc_Char) {
      res = s.lastIndexOf(sc_char2string(cset), start);
      return res >= 0 ? res : false;
   }
   if (cset.length == 1) {
      res = s.lastIndexOf(cset, start);
      return res >= 0 ? res : false;
   } else {
      for (var i = start; i >= 0; i-- ) {
	 if (cset.indexOf(s.charAt(i)) >= 0)
	    return i;
      }

      return false;
   }
}

/*** META ((export #t) (arity -3)) */
function sc_stringSkip(s, cset, start) {
   var set = (cset instanceof sc_Char) ? sc_char2string(cset) : cset;

   for( var i = start; i < s.length; i++ ) {
      if( set.indexOf( s.charAt( i ) ) < 0 ) {
	 return i;
      }
   }

   return false;
}

/*** META ((export #t) (arity -3)) */
function sc_stringSkipRight(s, cset, start) {
   var set = (cset instanceof sc_Char) ? sc_char2string(cset) : cset;

   for( var i = start; i >= 0; i-- ) {
      if( set.indexOf( s.charAt( i ) ) < 0 ) {
	 return i;
      }
   }

   return false;
}

/*** META ((export #t) (arity 1)) */
function sc_string_downcase(s) {
   return s.toLowerCase();
}

/*** META ((export #t) (arity 1)) */
function sc_string_upcase(s) {
   return s.toUpperCase();
}

/*** META ((export #t) (arity 1)) */
function sc_string_capitalize(s) {
   return s.replace(/\w+/g, function (w) {
	 return w.charAt(0).toUpperCase() + w.substr(1).toLowerCase();
      });
}

/*** META ((export #t) (arity 1)) */
function sc_prefix(s) {
   var i = s.lastIndexOf(".");
   return i ? s.substring(0, i) : s;
}   

/*** META ((export #t) (arity 1)) */
function sc_suffix(s) {
   var i = s.lastIndexOf(".");
   return i ? s.substring(i+1,i.length) : s;
}

/* OO bootstrap */
sc_register_class( sc_Object,
		   sc_string2symbol( sc_jsstring2string( "object" ) ),
		   sc_Object,
		   0,
		   function() { return new sc_Object(); },
		   false,
		   sc_makeVector( 0 ) );
// generated by ../bin/hopc -j --meta runtime/dsssl.scm -o runtime/dsssl.js
/* scheme2js generated file Fri Aug 23 07:32:02 2013 */
"use strict";

var adsssl = "keyword argument misses value";
var bdsssl = "dsssl-get-key-arg";
var cdsssl = "dsssl formal parsing";
var ddsssl = "Unexpected #!keys parameters";

/*** META ((export dsssl-check-key-args!)) */
function BGl_dssslzd2checkzd2keyzd2argsz12zc0zzdssslz00(a,b) {
  if ((((b) === null))) {
var e = 
function (b) {
  var f = b;
do {
if ((((f) === null))) {
return (a);
}
else {
var e = (!(((f) instanceof sc_Pair)));
if ((e !== false)) {
var c = e;
}
else {
var d = ((((((f).__hop_cdr))) === null));
if ((d !== false)) {
c = d;
}
else {
c = (!(sc_isKeyword((((f).__hop_car)))));
}
}
if ((c !== false)) {
return ((sc_error(cdsssl, ddsssl, f)));
}
else {
f = (((f).__hop_cdr.__hop_cdr));
}
}
} while (true);
 };
return ((e(a)));
}
else {
var d = null;
var c = 
function (c,d,e) {
  var j = c;
var k = d;
var l = e;
do {
if ((((j) === null))) {
return ((sc_reverseBang(l)));
}
else {
var i = (!(((j) instanceof sc_Pair)));
if ((i !== false)) {
var f = i;
}
else {
var h = ((((((j).__hop_cdr))) === null));
if ((h !== false)) {
f = h;
}
else {
var g = (!(sc_isKeyword((((j).__hop_car)))));
if ((g !== false)) {
f = g;
}
else {
f = (((sc_memq((((j).__hop_car)), b)) === false));
}
}
}
if ((f !== false)) {
if (((k === false))) {
j = (((j).__hop_cdr));
}
else {
k = false;
l = ((new sc_Pair((((j).__hop_car)), l)));
j = (((j).__hop_cdr));
}
}
else {
j = (((j).__hop_cdr.__hop_cdr));
k = true;
}
}
} while (true);
 };
return ((c(a, false, d)));
}
 };

/*** META ((export dsssl-get-key-arg)) */
function BGl_dssslzd2getzd2keyzd2argzd2zzdssslz00(c,d,e) {
  var f = 
function (c) {
  var f = c;
while ((!(((f) === null)))) {
if ((!(sc_isKeyword((((f).__hop_car)))))) {
f = (((f).__hop_cdr));
}
else {
if ((((((f).__hop_car))===d))) {
if ((!((((((f).__hop_cdr))) instanceof sc_Pair)))) {
return ((sc_error(bdsssl, adsssl, (((f).__hop_car)))));
}
else {
return ((((f).__hop_cdr.__hop_car)));
}
}
else {
if ((!((((((f).__hop_cdr))) instanceof sc_Pair)))) {
return ((sc_error(bdsssl, adsssl, (((f).__hop_car)))));
}
else {
f = (((f).__hop_cdr.__hop_cdr));
}
}
}
}
return (e);
 };
return ((f(c)));
 };

/*** META ((export dsssl-get-key-rest-arg)) */
function BGl_dssslzd2getzd2keyzd2restzd2argz00zzdssslz00(c,d) {
  var e = 
function (c) {
  var h = c;
do {
if ((((h) === null))) {
return (null);
}
else {
var g = (!(sc_isKeyword((((h).__hop_car)))));
if ((g !== false)) {
var e = g;
}
else {
var f = ((((((h).__hop_cdr))) === null));
if ((f !== false)) {
e = f;
}
else {
e = (((sc_memq((((h).__hop_car)), d)) === false));
}
}
if ((e !== false)) {
return (h);
}
else {
h = (((h).__hop_cdr.__hop_cdr));
}
}
} while (true);
 };
return ((e(c)));
 };
