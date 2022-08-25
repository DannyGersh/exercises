import React from "react";

function replacer(match, p1, p2, p3, offset, string) {
  return p2;
}
function trim(str) {
  return str.replace(/(\s*)(.+?)(\s*)$/g, replacer);
}

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      //var cookie = jQuery.trim(cookies[i]);
      var cookie = trim(cookies[i]);
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const CSRFToken = () => {
    var csrftoken = getCookie("csrftoken");
    //return <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
		return <input type="hidden" name="CSRFToken" value={csrftoken} />
};
export default CSRFToken;
