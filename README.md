# ABBA

Highly compact AtoB and BtoA conversion.&nbsp;
Safe for non-ascii letters (BtoA is not).&nbsp;
Customize-able to be efficient for common patterns in your environment.

	**TEXT** [41] '{"parameters":"alpha","series":[0,1,2,3]}'
	**ABBA** [42] 'zty39s0A4a0Sro039frw2Gfi-dszXL-1M-1N-1Ozll'
	**BTOA** [56] 'eyJwYXJhbWV0ZXJzIjoiYWxwaGEiLCJzZXJpZXMiOlswLDEsMiwzXX0='

### Why I built this

I put metadata all over the place, usually text strings with user-entered prose.&nbsp;
Sometimes JSON.&nbsp;
These spaces have different restrictions but Base 64 characters are universally safe.&nbsp;
A couple of these places have tight space limitations.&nbsp;

So I built this utility, which I use to "defang" strings, with minimal size inflation, so I can jam them into corners.


### Intended Purpose

There are many situations where you may want to place a string somewhere that special characters are not allowed.
Examples include:
- **url parameter** &nbsp; 
- **embedded metadata** &nbsp; in a file or http header
- **file metadata** &nbsp; AWS S3

Standard approaches have limitations.

**BTOA/ATOB**&nbsp;
35% inflation.&nbsp;
Non-ASCII characters fail; Try this:&nbsp; atob(btoa("β"))&nbsp;

**EncodeURI**&nbsp;
Ignores problematic characters.&nbsp;
Try this:&nbsp;  encodeURIComponent("it's")&nbsp;

**EncodeURI** **plus** **BTOA/ATOB**&nbsp;
Large inflation: Over 50% for most English prose.&nbsp;
But it IS comprehensive and safe.&nbsp;
Yay!&nbsp;

**ABBA**
ABBA is completely 'safe' -- converts characters into Base64 characters.&nbsp;
It converts non-ASCII characters and recovers them properly.&nbsp;
Its inflation is typically less than 10%; English prose is usually **shortened!**&nbsp;
(Your mileage may vary.)

ABBA has hooks for easy extension, should you have an application with oft-repeated string sequences.&nbsp;

### Basic Usage

	abba = new ABBA();
	abba.compress("foo");                         # LmM
	abba.decompress(abba.compress("foo"));        # foo

Really not much to basic usage, eh?

### Optimizing / customizing

This section coming soon.

### How ABBA works

First a nod to **SMAZ** which provided the launch pad for ABBA.&nbsp;
Thank you!

ABBA might be the most efficient AtoB converter out there.&nbsp;
(I would like to hear differently.&nbsp; Really.)&nbsp;
The new wrinkle with ABBA is that it uses 9-bit letters.&nbsp;
SMAZ uses 8-bit letters, as does every other system I can think of.&nbsp;

Why 9 bits?&nbsp;
Two reasons:
- 512 letter combinations may be encoded
- Two 9-bit letters fit nicely into three 6-bit B64 characters

ABBA converts strings into 9-bit letters and then slices those into 6-bit letters.&nbsp;
The result seems pretty optimal (casually speaking).

The initial ABBA lexicon is:

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
