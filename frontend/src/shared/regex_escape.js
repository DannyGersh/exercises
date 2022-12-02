/*
  Used like this:


      var regex = regex_escape([
        'foo',
        'bar',
        'http://example.com/page'
      ]);


  OR:


      var regex = regex_escape('http://example.com/page');


  It will escape any characters that could
  break a regular expression, so you don't
  have to type out all that junk manually.
*/

// Escape regular expression
function regex_escape(thing) {
  // Escape the string
  function esc(str) {
    return str.toString().replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  }

  // Used in loop
  var arr, i;

  // Is it an array?
  if (Object.prototype.toString.call(thing) === '[object Array]') {
    arr = [];
    i = thing.length;

    while (i--) {
      arr.push(esc(thing[i]));
    }

    return new RegExp(arr.join('|'), 'gms');
  }
  // Assume individual string
  else {
    return new RegExp(esc(thing), 'gms');
  }
}
export default regex_escape;
