"use strict";
const apexCharts = require("apexcharts");
const DA = require("../js/data.analysis");
function displayAnalysis(data) {
    const daIncome = new DA(data).setRowName("Paid Price").sum;
    const daProducts = new DA(data).setRowName("Course Name").item.length;
    const daStudents = new DA(data).setRowName("User Name").item.length;
    const incomeElement = (document.getElementById("income"));
    incomeElement.innerHTML = daIncome + " €";
    const productsElement = document.getElementById("products");
    productsElement.innerHTML = daProducts;
    const productsTitleElement = (document.getElementById("products-title"));
    productsTitleElement.innerHTML = daProducts <= 1 ? "Produkt" : "Produkts";
    const studentsElement = document.getElementById("students");
    studentsElement.innerHTML = daStudents;
    const minMax = new DA(data).setRowName("Formatted Date", "date");
    const startDateElement = document.getElementById("start-date");
    startDateElement.innerHTML = minMax.dateMin;
    const endDateElement = document.getElementById("end-date");
    endDateElement.innerHTML = minMax.dateMax;
}
function pieChart(date) {
    const vendor = new DA(date);
    vendor.setRowName("Vendor");
    const vendorName = vendor.getOption().item;
    const vendorRepeated = vendor.getOption().repeated;
    let options = {
        series: vendorRepeated,
        title: {
            text: "Vendors Analysis",
            align: "center",
            margin: 10,
            offsetX: 0,
            offsetY: 0,
            floating: false,
            style: {
                color: "#009f3b",
            },
        },
        chart: {
            type: "pie",
            toolbar: {
                show: true,
            },
        },
        labels: vendorName,
        responsive: [
            {
                breakpoint: 920,
                options: {
                    chart: {
                        with: 550,
                    },
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
    };
    let chart = new apexCharts(document.getElementById("pie-chart"), options);
    chart.render();
}
function areaChart(res) {
    const dataAnalysis = new DA(res);
    dataAnalysis.setRowName("Formatted Date", "date");
    let data = dataAnalysis.getOption().repeated;
    let date = dataAnalysis.getOption().dateYYYYMMDD;
    let options = {
        chart: {
            height: 350,
            width: "100%",
            type: "area",
            animations: {
                initialAnimation: {
                    enabled: false,
                },
            },
        },
        series: [
            {
                name: "Series 1",
                data: data,
            },
        ],
        stroke: {
            curve: "straight",
        },
        xaxis: {
            type: "datetime",
            categories: date,
        },
    };
    let chart = new apexCharts(document.getElementById("area-chart"), options);
    chart.render();
}
function barChart(res) {
    const dataAnalysis = new DA(res);
    dataAnalysis.setRowName("Formatted Date", "date");
    let data = dataAnalysis.getOption().repeatedWeekday;
    let options = {
        series: [
            {
                data: data,
            },
        ],
        chart: {
            type: "bar",
            height: 380,
        },
        plotOptions: {
            bar: {
                barHeight: "100%",
                distributed: true,
                horizontal: true,
                dataLabels: {
                    position: "bottom",
                },
            },
        },
        colors: [
            "#33b2df",
            "#546E7A",
            "#d4526e",
            "#13d8aa",
            "#A5978B",
            "#2b908f",
            "#f9a3a4",
        ],
        dataLabels: {
            enabled: true,
            textAnchor: "start",
            style: {
                colors: ["#fff"],
            },
            formatter: function (val, opt) {
                return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
            },
            offsetX: 0,
            dropShadow: {
                enabled: true,
            },
        },
        stroke: {
            width: 1,
            colors: ["#fff"],
        },
        xaxis: {
            categories: [
                "Montag",
                "Dienstag",
                "Mittwoch",
                "Donnerstag",
                "Freitag",
                "Samstag",
                "Sonntag"
            ],
        },
        yaxis: {
            labels: {
                show: false,
            },
        },
        title: {
            text: "An welchem Wochentag wurde das Produkt mehr gekauft!",
            align: "center",
            floating: true,
        },
        tooltip: {
            theme: "dark",
            x: {
                show: false,
            },
            y: {
                title: {
                    formatter: function () {
                        return "";
                    },
                },
            },
        },
    };
    let chart = new apexCharts(document.getElementById("bar-chart"), options);
    chart.render();
}
module.exports = {
    displayAnalysis,
    pieChart,
    areaChart,
    barChart,
};
