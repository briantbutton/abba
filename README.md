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
Large inflation: Over 50% for most English prose
Comprehensive and safe.  Yay!&nbsp;

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

