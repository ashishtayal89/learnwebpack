console.log("Load index.js");

import _ from "lodash";
import module1 from './module1.js';

function component() {
  const element = document.createElement("div");

  // Lodash, currently included via a script, is required for this line to work
  // Lodash, now imported by this script
  element.innerHTML = _.join(["Hello", "webpack"], " ");

  return element;
}

document.body.appendChild(component());

import(/* webpackChunkName: "async" */ "./lazy").then(
  ({ default: LazyComponent }) => {
    console.log(`Load ${LazyComponent.Name}.js`);
  }
);
