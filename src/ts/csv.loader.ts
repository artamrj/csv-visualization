//?? How to know multieplte CSV Parse!

const { ipcRenderer } = require("electron");

const dashboardPage = require("./dashboard");

const csvParser = require("csv-parser");
const fs = require("fs");

module.exports = class CSV {
  results: any[];
  idDragAndDropBox: any;
  idBtnBrowseFiles: any;
  idListCSV: any;
  controller: boolean;
  controllerNoRepeat: any[];
  constructor(idDragAndDropBox: any, idBtnBrowseFiles: any, idListCSV: any) {
    this.results = [];
    this.idDragAndDropBox = idDragAndDropBox;
    this.idBtnBrowseFiles = idBtnBrowseFiles;
    this.idListCSV = idListCSV;
    this.controller = false;
    this.controllerNoRepeat = [];
  }

  dragAndDrop() {
    const dragAndDropElement = <HTMLElement>(
      document.getElementById(`${this.idDragAndDropBox}`)
    );

    dragAndDropElement.addEventListener("drop", (event: any) => {
      event.preventDefault();
      event.stopPropagation();

      dragAndDropElement.style.backgroundColor = "#FFF";
      dragAndDropElement.style.opacity = "";

      let files: any = event.dataTransfer.files;

      for (let file of files) {
        if (file.type == "text/csv") {
          this.controller = true;
        } else {
          this.controller = false;
        }
      }
      if (this.controller == true) {
        for (let fileDD of files) {
          this.parse(fileDD.name, fileDD.path);
        }
      } else {
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

    dragAndDropElement.addEventListener("dragover", (e: any) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  browseFile() {
    const browseFileElement = <HTMLElement>(
      document.getElementById(`${this.idBtnBrowseFiles}`)
    );

    browseFileElement.addEventListener("click", async () => {
      var files = await ipcRenderer.invoke("dialog:open");

      Array.of(files).forEach((fileCSV: any) => {
        fileCSV.filePaths.forEach((filePath: any) => {
          let name = filePath.replace(/^.*[\\\/]/, "");

          this.parse(name, filePath);
        });
      });
    });
  }

  parse(fileName: string, filePath: null) {
    let checkRepeat: boolean = false;

    try {
      this.controllerNoRepeat.forEach((noRepeat: any) => {
        if (noRepeat == fileName) {
          checkRepeat = true;
        }
      });
    } catch (error) {
      console.log(error);
    }

    if (checkRepeat) {
      alert("Diese File ist Wiederholt!");
    } else {
      if (filePath !== null || undefined) {
        this.controllerNoRepeat.push(fileName);

        // console.log(fileName);
        // console.log(filePath);

        const listCsvElement = <HTMLElement>(
          document.getElementById(`${this.idListCSV}`)
        );

        let htmlLiListCSV = `<li class="list-group-item d-flex justify-content-between align-items-center">
        ${fileName}
        </li>`;

        listCsvElement.insertAdjacentHTML("beforeend", htmlLiListCSV);

        try {
          let controlRes: any[];

          fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("data", (data: any) => controlRes.push(data))
            .on("end", () => {
              let newRes: any[] = controlRes.slice(14);

              newRes = newRes.map((element: any) => ({
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

              let endArrayDel: number = newRes.findIndex(
                (element: any) => element["Transaction Id"] == "Refunds"
              );

              newRes = newRes.splice(0, endArrayDel);

              newRes.forEach((nR: any) => {
                this.results.push(nR);
              });
            });

          controlRes = [];
        } catch (error) {
          console.log(error);
        }
      }

      const dragAndDropElement = <HTMLElement>(
        document.getElementById("drag-drop-box")
      );
      dragAndDropElement.style.padding = "90px 20px 90px 20px";

      const bVisualizingElement = <HTMLElement>(
        document.getElementById("b-visualizing")
      );
      bVisualizingElement.removeAttribute("hidden");
      bVisualizingElement.addEventListener("click", () => {
        this.dragDropBoxVisibility();
        dashboardPage.displayAnalysis(this.results);
        dashboardPage.pieChart(this.results);
        dashboardPage.areaChart(this.results);
        dashboardPage.barChart(this.results);
      });

      const btnReloadElement = <HTMLElement>(
        document.getElementById("btn-reload")
      );
      btnReloadElement.removeAttribute("hidden");
      btnReloadElement.addEventListener("click", () => {
        location.reload();
      });
    }
  }

  dragDropBoxVisibility() {
    const sectionParts = document.querySelectorAll("#section-part");

    sectionParts.forEach((sp: any) => {
      if (sp["hidden"]) {
        sp.removeAttribute("hidden");
      } else {
        sp.setAttribute("hidden", true);
      }
    });
  }
};
