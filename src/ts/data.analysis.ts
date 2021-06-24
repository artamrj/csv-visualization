var Moment = require("moment");

module.exports = class DataAnalysis {
  data: any;
  rowNameCols: any[];
  allDate: any[];
  itemDateYYYYMMDD: any[];
  weekDay: any[];
  dateMin: any;
  dateMax: any;
  items: any[];
  countItems: any;
  itemRepeated: any[];
  sum: number;
  constructor(data: any) {
    this.data = data;

    this.rowNameCols = [];

    //Date
    this.allDate = [];
    this.itemDateYYYYMMDD = [];
    this.weekDay = [];

    //DateMinMax
    this.dateMin, this.dateMax;

    //itemsAnalysis
    this.items = [];
    this.countItems = {};
    this.itemRepeated = [];

    //
    this.sum = 0;

    //
  }

  setRowName(itemRowName: string, type: string) {
    try {
      Array.from(this.data).forEach((row: any) => {
        switch (type) {
          case undefined:
            this.rowNameCols.push(row[itemRowName]);
            break;
          case "date":
            this.rowNameCols.push(new Date(row[itemRowName]));
            break;
          default:
            this.rowNameCols.push(row[itemRowName]);
            break;
        }
      });
      if (type == "date") {
        this.analysisItems();
        this.analysisDate();
      } else {
        this.analysisItems();
      }
      return this.getOption();
    } catch (error) {
      console.log(error);
    }
  }

  analysisItems() {
    try {
      this.rowNameCols.forEach((item: any) => {
        this.countItems[item] = (this.countItems[item] || 0) + 1;
      });

      for (const [item, repeated] of Object.entries(this.countItems)) {
        this.items.push(item);
        this.itemRepeated.push(repeated);
      }

      this.rowNameCols.forEach((num) => {
        this.sum = this.sum + parseFloat(num);
      });
    } catch (error) {
      console.log(error);
    }
  }

  analysisDate() {
    try {
      this.rowNameCols.forEach((col) => {
        this.allDate.push(new Date(col));
      });

      //YYYY-MM-DD
      let sortedDate = this.items.sort(
        (a: any, b: any) =>
          new Moment(a).format("YYYYMMDD") - new Moment(b).format("YYYYMMDD")
      );

      sortedDate.forEach((sDate: any) => {
        this.itemDateYYYYMMDD.push(new Moment(sDate).format("YYYY-MM-DD"));
      });

      //WEEK DAY
      let day: any[] = [
        { day: "Sonntag", repeated: 0 },
        { day: "Montag", repeated: 0 },
        { day: "Dienstag", repeated: 0 },
        { day: "Mittwoch", repeated: 0 },
        { day: "Donnerstag", repeated: 0 },
        { day: "Freitag", repeated: 0 },
        { day: "Samstag", repeated: 0 },
      ];

      this.allDate.forEach((aDate: any) => {
        let getDay: number = new Date(aDate).getDay();
        day[getDay].repeated = day[getDay].repeated + 1;
      });

      day.push(day.splice(0, 1)[0]);

      this.weekDay = day.map((a) => a.repeated);

      //MIN and MAX
      this.dateMin = new Date(
        Math.min.apply(null, this.allDate)
      ).toLocaleString("de-DE", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      this.dateMax = new Date(
        Math.max.apply(null, this.allDate)
      ).toLocaleString("de-DE", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.log(error);
    }
  }

  getOption() {
    return {
      //DATE
      dateMin: this.dateMin,
      dateMax: this.dateMax,
      dateYYYYMMDD: this.itemDateYYYYMMDD,
      repeatedWeekday: this.weekDay,

      //Normal
      item: this.items,
      repeated: this.itemRepeated,
      all: this.items,
      sum: Math.round(this.sum),
    };
  }

  comparisonVsDate(itemRowNameComparison: string, itemRowNameDate: string) {}
};
