//  require("./login");
let img = document.createElement("img");
img.style.height = "25%";
img.style.width = "25%";
img.src = require("../Images/webpack.jpeg");
document.getElementById("image_Tag").appendChild(img);

require("../css/common.css");
require("../css/app.css");
require("../css/index.scss");
require("../css/index.less");
import {login} from "./login";

console.log("app!!");
console.log(login, "in app");
debugger;