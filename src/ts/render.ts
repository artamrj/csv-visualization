const CSVClass = require("./csv.loader");

const csv = new CSVClass("drag-drop-box", "btn-get-file", "list-csv");

csv.dragAndDrop();
csv.browseFile();

document.getElementById("btn-back")?.addEventListener("click", () => {
  location.reload();
})