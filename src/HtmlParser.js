import React from 'react';

const HtmlParser = (htmlString) => {
    var ele = document.createElement('html');
    ele.innerHTML = htmlString;
    return ele.innerText;
};

export default HtmlParser;