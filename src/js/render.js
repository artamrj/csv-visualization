"use strict";
var _a;
const CSVClass = require("./csv.loader");
const csv = new CSVClass("drag-drop-box", "btn-get-file", "list-csv");
csv.dragAndDrop();
csv.browseFile();
(_a = document.getElementById("btn-back")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    location.reload();
});
