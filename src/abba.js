//  ABBA  ABBA  ABBA  ABBA  ABBA  ABBA  ABBA  ABBA  ABBA 
// 
// atob and btoa
(function() {

  var root                       = this,
      maxCodeSize                = 0,
      flagSingle                 = 511,
      flagMulti                  = 510,
      lastCode                   = 509,
      notPermitted               = /[^a-zA-Z0-9+-]/, 
      codesIn                    = {}, codesOut, b64bits;

  if ( typeof module === 'object' && module.exports ) {
    module.exports = ABBA;
  }
  if ( typeof define === 'function' && define.amd ) {
    define ( 'abba' , [], function() { return ABBA } )
  }
  b64bits                        = {
    "0" : "000000" , "1" : "000001" , "2" : "000010" , "3" : "000011" , "4" : "000100" , "5" : "000101" , "6" : "000110" , "7" : "000111" ,
    "8" : "001000" , "9" : "001001" , "A" : "001010" , "B" : "001011" , "C" : "001100" , "D" : "001101" , "E" : "001110" , "F" : "001111" ,
    "G" : "010000" , "H" : "010001" , "I" : "010010" , "J" : "010011" , "K" : "010100" , "L" : "010101" , "M" : "010110" , "N" : "010111" ,
    "O" : "011000" , "P" : "011001" , "Q" : "011010" , "R" : "011011" , "S" : "011100" , "T" : "011101" , "U" : "011110" , "V" : "011111" ,
    "W" : "100000" , "X" : "100001" , "Y" : "100010" , "Z" : "100011" , "a" : "100100" , "b" : "100101" , "c" : "100110" , "d" : "100111" ,
    "e" : "101000" , "f" : "101001" , "g" : "101010" , "h" : "101011" , "i" : "101100" , "j" : "101101" , "k" : "101110" , "l" : "101111" ,
    "m" : "110000" , "n" : "110001" , "o" : "110010" , "p" : "110011" , "q" : "110100" , "r" : "110101" , "s" : "110110" , "t" : "110111" ,
    "u" : "111000" , "v" : "111001" , "w" : "111010" , "x" : "111011" , "y" : "111100" , "z" : "111101" , "+" : "111110" , "-" : "111111" 
  };
    b64digits                    = 
    //   0       8       16      24      32      40      48      56      64
    //   v       v       v       v       v       v       v       v       v
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-";
    b64digits                    = b64digits.split('');


  codesOut = [
      // 1 letter codes
      ""      , "a"     , "á"     , "à"     , "â"     , "b"     , "c"     , "d"     , "e"     , "è"     , "é"     , "f"     , "g"     , "h"     , "i"     , "í"     ,               //   0
      "j"     , "k"     , "l"     , "m"     , "n"     , "ñ"     , "o"     , "ô"     , "ó"     , "p"     , "q"     , "r"     , "s"     , "t"     , "u"     , "v"     ,
      "w"     , "x"     , "y"     , "z"     , "ç"     , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      ,               //  32
      "A"     , "B"     , "C"     , "D"     , "E"     , "F"     , "G"     , "H"     , "I"     , "J"     , "K"     , "L"     , "M"     , "N"     , "O"     , "P"     ,
      "Q"     , "R"     , "S"     , "T"     , "U"     , "V"     , "W"     , "X"     , "Y"     , "Z"     , ""      , ""      , ""      , ""      , ""      , ""      ,               //  64
      ""      , ""      , ""      , ""      , ""      , "0"     , "1"     , "2"     , "3"     , "4"     , "5"     , "6"     , "7"     , "8"     , "9"     , " "     , 
      // 2 letter codes
      "li"    , "he"    , "an"    , "in"    , "er"    , "on"    , "re"    , "ed"    , "nd"    , "ha"    , "at"    , "en"    , "es"    , "of"    , "nt"    , "ea"    ,
      "ti"    , "to"    , "io"    , "le"    , "is"    , "ou"    , "ar"    , "as"    , "de"    , "rt"    , "ve"    , "st"    , "or"    , "it"    , "te"    , "ng"    ,               //  96
      "al"    , "be"    , "se"    , "hi"    , "me"    , "ri"    , "ro"    , "co"    , "by"    , "di"    , "ra"    , "ic"    , "ce"    , "la"    , "ne"    , "we"    ,
      "om"    , "ur"    , "th"    , "ch"    , "sh"    , "wh"    , "ma"    , "el"    , "so"    , "no"    , "iv"    , "ho"    , "ns"    , "us"    , "tr"    , "ta"    ,               // 128
      "ot"    , "un"    , "im"    , "nc"    , "ad"    , "ly"    , "id"    , "ac"    , "il"    , "ge"    , "pe"    , "si"    , "wa"    , "ec"    , "fo"    , "rs"    ,
      "ca"    , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      ,               // 160
      ""      , ""      , ""      , ""      , ""      , ""      , ""      , "pp"    , "rr"    , "mm"    , "ll"    , "ff"    , "tt"    , "ss"    , "oo"    , "ee"    ,
      " n"    , " l"    , " g"    , " e"    , " t"    , " o"    , " a"    , " w"    , " b"    , " c"    , " d"    , " s"    , " f"    , " m"    , " r"    , " h"    ,               // 192
      " i"    , " y"    , " p"    , ""      , ""      , ""      , ""      , " T"    , " O"    , " A"    , " W"    , " B"    , " C"    , " D"    , " S"    , " F"    ,
      " M"    , " R"    , " H"    , " I"    , " Y"    , " E"    , " G"    , " L"    , " N"    , " P"    , ""      , ""      , ""      , ""      , ""      , ""      ,               // 224
      "y "    , "f "    , "l "    , "o "    , "e "    , "s "    , "t "    , "d "    , "n "    , "r "    , ""      , ""      , ""      , ""      , ""      , "  "    ,
      // 3 letter codes
      "the"   , "and"   , "tha"   , "ent"   , "ion"   , "tio"   , "for"   , "nde"   , "has"   , "nce"   , "oft"   , "men"   , "had"   , "ere"   , "one"   , "but"   ,               // 256
      "ter"   , "hat"   , "ati"   , "ass"   , "our"   , "who"   , "ate"   , "ver"   , "was"   , "ing"   , "his"   , "all"   , "are"   , "not"   , "her"   , "its"   ,
      "sth"   , "tis"   , "edt"   , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      ,               // 288
      " wa"   , " re"   , " fo"   , " on"   , " ha"   , " cl"   , " we"   , " th"   , " of"   , " an"   , " in"   , " to"   , " wh"   , " co"   , " be"   , ""      ,
      "is "   , "er "   , "es "   , "at "   , "as "   , "on "   , "or "   , "ch "   , "ly "   , "en "   , "to "   , "nd "   , "ed "   , "ad "   , "of "   , "he "   ,               // 320
      "ng "   , "in "   , "re "   , "nt "   , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , "The"   ,
      // 4 letter codes
      ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      ,               // 384
      "ion "  , "ing "  , "ist "  , "ous"   , "ent "  , "ble "  , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      ,
      // 5 letter codes
      "ence " , "ance " , "tion " , "ment " , "ious " , "ight " , ""      , ""      , ""      , ""      , "stale" , "orient", "ation" , "height", "width" , "ption" ,               // 416
      // special-purpose codes
      "¹"     , "²"     , "³"     , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , '":"'   , '","'   ,
      ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      ,               // 160
      // non-ascii codes
      "α"     , "β"     , "γ"     , "δ"     , "ε"     , "ƒ"     , "η"     , "ι"     , "κ"     , "λ"     , "μ"     , "ν"     , "ω"     , "π"     , "φ"     , "ρ"     ,               // 448
      "σ"     , "τ"     , "υ"     , "ξ"     , "χ"     , "ψ"     , "ζ"     , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      , ""      ,
      // ascii symbol codes
      "+"     , "-"     , "="     , "!"     , "$"     , "?"     , "_"     , "%"      , "<"     , ">"     , "("     , ")"     , "["     , "]"     , "{"     , "}"    ,               // 480
      "&"     , "~"     , "|"     , "^"     , "`"     , ";"     , ":"     , ", "     , ","     , "."     , "\n"    , "\r"    , "\""    , "'"     , null    , null 
  ];

  codesOut.forEach(function(code,ix){
    if ( typeof code === "string" && code.length ) {
      codesIn[code]              = ix;
      maxCodeSize                = Math.max(maxCodeSize,code.length)
    }
  });

  ABBA.parentfunction            = function(x){

  };


  function ABBA(){

    var abba                     = this;

    this.compress                = function(input){
      if ( typeof input === "string" ) {
        return compress ( input )
      }else{
        return input
      }
    };
    this.decompress              = function(input){
      if ( typeof input === "string" ) {
        return decompress ( input )
      }else{
        return input
      }
    };
  };    

  return ABBA;


  function compress(input){
    var code, encoded, inputIx, i, j, x , 
        inputIx                  = 0,
        output                   = [],
        y                        = -1,
        finalOutput              = "",
        verbatim                 = "";
    while ( inputIx < input.length ) {
      encoded                    = false;
      j                          = Math.min(maxCodeSize,input.length-inputIx);
      for ( j = i = j; j <= 0 ? i < 0 : i > 0; j = j <= 0 ? ++i : --i ) {
        code                     = codesIn[input.substr(inputIx, j)];
        if ( code != null ) {
          if (verbatim) {
            output               = output.concat(flush(verbatim));
            verbatim             = "";
          }
          output.push(code);
          inputIx               += j;
          encoded                = true;
          break;
        }
      }
      if (!encoded) {
        verbatim                += input[inputIx];
        inputIx++;
        if ( verbatim.length === 256 ) {
          output                 = output.concat(flush(verbatim));
          verbatim               = "";
        }
      }
    }
    if (verbatim) {
       output                    = output.concat(flush(verbatim));
    }
    if((output.length%2)===1){output.unshift(0)}
    x                            = output.length/2-1;
    while(x>y++){
      finalOutput                = finalOutput+B512toB64_3bytes_combine(output[y+y],output[y+y+1])
    }
    return finalOutput;
  };
  function decompress(strInput) {
    var j,_i,ref;
    var x=strInput.length/3-1,y=-1,output="",i=0,input=[],failed=false;
    if ( ( strInput.length % 3 ) !== 0 || strInput.match(notPermitted) ) {
      return strInput                          /* throw 'Oops Malformed BBAZ' */ 
    }else{
      while(x>y++){input=input.concat(B64toB512_3bytes_combine(strInput.substring(y+y+y,y+y+y+3)))}
      while(i<input.length&&!failed){
        if (input[i] === flagSingle) {
          if (i + 1 > input.length) {
            failed               = true              // throw 'Malformed BBAZ';
          }
          output += String.fromCharCode(input[i+1]);
          i += 2;
        } else { 
          if (input[i] === flagMulti) {
            if (i + input[i + 1] + 2 >= input.length) {
              failed           = true              // throw 'Malformed BBAZ';
            }else{
              for ( j = _i = 0, ref = input[i + 1] + 1; 0 <= ref ? _i < ref : _i > ref; j = 0 <= ref ? ++_i : --_i ) {
                output += String.fromCharCode(input[i+2+j])
              }
            }
            i += 3 + input[i+1]
          } else {
            output += codesOut[input[i]];
            i++;
          }
        }
      }
      return failed ? strInput : output
    }
  };
  function flush(verbatim) {
    var k, output, i, len,cc;
    output = [];
    if (verbatim.length > 1) {
      output.push(flagMulti);
      output.push(verbatim.length-1);
    } else {
      output.push(flagSingle);
    }
    for (i = 0, len = verbatim.length; i < len; i++) {
      k  = verbatim[i];
      cc = k.charCodeAt(0);
      if(cc>lastCode){cc=0}
      output.push(cc);
    }
    return output;
  };
  function B512toB64_3bytes_combine(int1,int2){
    var safeInt                  = int1*512+int2;
    return b64digits[Math.floor(0.0000001+safeInt/4096)]+b64digits[Math.floor(0.00001+(safeInt%4096)/64)]+b64digits[Math.floor(0.00001+(safeInt%64))]
  };
  function B64toB512_3bytes_combine(str){
    var safeInt                  = parseInt(b64bits[str.charAt(0)]+b64bits[str.charAt(1)]+b64bits[str.charAt(2)],2);
    return [Math.floor(0.00001+safeInt/512),(safeInt%512)]
  };

}).call(this);
