import React from "react";
import getCookie from "./Functions";

const CSRFToken = () => {
    var csrftoken = getCookie("csrftoken");
    return <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
};
export default CSRFToken;
