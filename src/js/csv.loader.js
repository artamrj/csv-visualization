"use strict";
//?? How to know multieplte CSV Parse!
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { ipcRenderer } = require("electron");
const dashboardPage = require("./dashboard");
const csvParser = require("csv-parser");
const fs = require("fs");
module.exports = class CSV {
    constructor(idDragAndDropBox, idBtnBrowseFiles, idListCSV) {
        this.results = [];
        this.idDragAndDropBox = idDragAndDropBox;
        this.idBtnBrowseFiles = idBtnBrowseFiles;
        this.idListCSV = idListCSV;
        this.controller = false;
        this.controllerNoRepeat = [];
    }
    dragAndDrop() {
        const dragAndDropElement = (document.getElementById(`${this.idDragAndDropBox}`));
        dragAndDropElement.addEventListener("drop", (event) => {
            event.preventDefault();
            event.stopPropagation();
            dragAndDropElement.style.backgroundColor = "#FFF";
            dragAndDropElement.style.opacity = "";
            let files = event.dataTransfer.files;
            for (let file of files) {
                if (file.type == "text/csv") {
                    this.controller = true;
                }
                else {
                    this.controller = false;
                }
            }
            if (this.controller == true) {
                for (let fileDD of files) {
                    this.parse(fileDD.name, fileDD.path);
                }
            }
            else {
                alert("Es gibt ein Problem! Das File ist nicht CSV");
            }
        });
        dragAndDropElement.addEventListener("dragenter", () => {
            dragAndDropElement.style.backgroundColor = "#e5e5f7";
            dragAndDropElement.style.opacity = "0.3";
            dragAndDropElement.style.background = "radial-gradient(circle, transparent 20%, #e5e5f7 20%, #e5e5f7 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, #e5e5f7 20%, #e5e5f7 80%, transparent 80%, transparent) 27.5px 27.5px, linear-gradient(#444cf7 2.2px, transparent 2.2px) 0 -1.1px, linear-gradient(90deg, #444cf7 2.2px, #e5e5f7 2.2px) -1.1px 0; background-size: 55px 55px, 55px 55px, 27.5px 27.5px, 27.5px 27.5px;";
        });
        dragAndDropElement.addEventListener("dragleave", () => {
            dragAndDropElement.style.backgroundColor = "#FFF";
            dragAndDropElement.style.opacity = "";
        });
        dragAndDropElement.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    }
    browseFile() {
        const browseFileElement = (document.getElementById(`${this.idBtnBrowseFiles}`));
        browseFileElement.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            var files = yield ipcRenderer.invoke("dialog:open");
            Array.of(files).forEach((fileCSV) => {
                fileCSV.filePaths.forEach((filePath) => {
                    let name = filePath.replace(/^.*[\\\/]/, "");
                    this.parse(name, filePath);
                });
            });
        }));
    }
    parse(fileName, filePath) {
        let checkRepeat = false;
        try {
            this.controllerNoRepeat.forEach((noRepeat) => {
                if (noRepeat == fileName) {
                    checkRepeat = true;
                }
            });
        }
        catch (error) {
            console.log(error);
        }
        if (checkRepeat) {
            alert("Diese File ist Wiederholt!");
        }
        else {
            if (filePath !== null || undefined) {
                this.controllerNoRepeat.push(fileName);
                // console.log(fileName);
                // console.log(filePath);
                const listCsvElement = (document.getElementById(`${this.idListCSV}`));
                let htmlLiListCSV = `<li class="list-group-item d-flex justify-content-between align-items-center">
        ${fileName}
        </li>`;
                listCsvElement.insertAdjacentHTML("beforeend", htmlLiListCSV);
                try {
                    let controlRes;
                    fs.createReadStream(filePath)
                        .pipe(csvParser())
                        .on("data", (data) => controlRes.push(data))
                        .on("end", () => {
                        let newRes = controlRes.slice(14);
                        newRes = newRes.map((element) => ({
                            "Transaction Id": element["Your total earnings"],
                            "Formatted Date": element["_1"],
                            "User Name": element["_2"],
                            "Course Name": element["_3"],
                            "Coupon Code": element["_4"],
                            "Revenue Channel": element["_5"],
                            Vendor: element["_6"],
                            "Paid Price": element["_7"],
                            "Transaction Currency": element["_8"],
                            "Tax Amount": element["_9"],
                            "Store Fee": element["_10"],
                            "Share Price": element["_11"],
                            "Instructor Share": element["_12"],
                            "Tax Rate": element["_13"],
                            "Exchange Rate": element["_14"],
                        }));
                        let endArrayDel = newRes.findIndex((element) => element["Transaction Id"] == "Refunds");
                        newRes = newRes.splice(0, endArrayDel);
                        newRes.forEach((nR) => {
                            this.results.push(nR);
                        });
                    });
                    controlRes = [];
                }
                catch (error) {
                    console.log(error);
                }
            }
            const dragAndDropElement = (document.getElementById("drag-drop-box"));
            dragAndDropElement.style.padding = "90px 20px 90px 20px";
            const bVisualizingElement = (document.getElementById("b-visualizing"));
            bVisualizingElement.removeAttribute("hidden");
            bVisualizingElement.addEventListener("click", () => {
                this.dragDropBoxVisibility();
                dashboardPage.displayAnalysis(this.results);
                dashboardPage.pieChart(this.results);
                dashboardPage.areaChart(this.results);
                dashboardPage.barChart(this.results);
            });
            const btnReloadElement = (document.getElementById("btn-reload"));
            btnReloadElement.removeAttribute("hidden");
            btnReloadElement.addEventListener("click", () => {
                location.reload();
            });
        }
    }
    dragDropBoxVisibility() {
        const sectionParts = document.querySelectorAll("#section-part");
        sectionParts.forEach((sp) => {
            if (sp["hidden"]) {
                sp.removeAttribute("hidden");
            }
            else {
                sp.setAttribute("hidden", true);
            }
        });
    }
};
