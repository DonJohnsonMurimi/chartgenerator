/*=========================================================
        UNIVERSAL CHART GENERATOR
        Version 1.0
        PART 1

        Topics Covered

        ✔ File Upload
        ✔ FileReader API
        ✔ PapaParse
        ✔ SheetJS
        ✔ Arrays
        ✔ Objects
        ✔ DOM Manipulation
==========================================================*/


//==========================================================
// GLOBAL VARIABLES
//==========================================================

// Stores all uploaded records
let dataset = [];

// Stores the current chart
let currentChart = null;


//==========================================================
// GET HTML ELEMENTS
//==========================================================

const csvFile = document.getElementById("csvFile");

const excelFile = document.getElementById("excelFile");

const xAxis = document.getElementById("xAxis");

const yAxis = document.getElementById("yAxis");

const chartType = document.getElementById("chartType");

const generateChart = document.getElementById("generateChart");

const clearChart = document.getElementById("clearChart");

const chartCanvas = document.getElementById("myChart");


//==========================================================
// EVENT LISTENERS
//==========================================================

// Read CSV
csvFile.addEventListener("change", readCSV);

// Read Excel
excelFile.addEventListener("change", readExcel);


//==========================================================
// READ CSV FILE
//==========================================================

function readCSV(event){

    // Get selected file
    let file = event.target.files[0];

    // Check if a file was selected
    if(!file){

        return;

    }

    // Read CSV using PapaParse
    Papa.parse(file,{

        header:true,

        skipEmptyLines:true,

        complete:function(results){

            dataset = results.data;

            console.log("CSV DATA");

            console.table(dataset);

            loadColumns();

        }

    });

}


//==========================================================
// READ EXCEL FILE
//==========================================================

function readExcel(event){

    let file = event.target.files[0];

    if(!file){

        return;

    }

    let reader = new FileReader();

    reader.onload = function(e){

        // Read Excel file
        let data = new Uint8Array(e.target.result);

        // Workbook
        let workbook = XLSX.read(data,{

            type:"array"

        });

        // First Sheet
        let sheetName = workbook.SheetNames[0];

        let worksheet = workbook.Sheets[sheetName];

        // Convert Sheet to JSON
        dataset = XLSX.utils.sheet_to_json(worksheet);

        console.log("EXCEL DATA");

        console.table(dataset);

        loadColumns();

    };

    reader.readAsArrayBuffer(file);

}


//==========================================================
// LOAD COLUMN NAMES
//==========================================================

function loadColumns(){

    // Remove old options
    xAxis.innerHTML = "";

    yAxis.innerHTML = "";


    // Check if dataset is empty
    if(dataset.length===0){

        return;

    }


    // Get column names
    let columns = Object.keys(dataset[0]);

    console.log("Detected Columns");

    console.log(columns);


    // Add every column to both dropdowns

    columns.forEach(function(column){

        // X-Axis Option
        let option1 = document.createElement("option");

        option1.value = column;

        option1.textContent = column;

        xAxis.appendChild(option1);


        // Y-Axis Option
        let option2 = document.createElement("option");

        option2.value = column;

        option2.textContent = column;

        yAxis.appendChild(option2);

    });


    // Notify user
    alert("Dataset loaded successfully.");

}


//==========================================================
// TEST DATA
//==========================================================

// Uncomment if you want to test without uploading files

/*
dataset = [

    {
        Name:"John",
        Gender:"Male",
        Course:"ICT",
        Marks:78,
        Hours:4
    },

    {
        Name:"Mary",
        Gender:"Female",
        Course:"Business",
        Marks:91,
        Hours:6
    },

    {
        Name:"Peter",
        Gender:"Male",
        Course:"ICT",
        Marks:45,
        Hours:2
    },

    {
        Name:"Jane",
        Gender:"Female",
        Course:"Accounting",
        Marks:63,
        Hours:3
    }

];

loadColumns();

*/

/*=========================================================
        UNIVERSAL CHART GENERATOR
        Version 1.0
        PART 2

        Topics Covered

        ✔ Event Listeners
        ✔ Grouping Data
        ✔ Aggregation
        ✔ Chart.js
==========================================================*/


//==========================================================
// GENERATE BUTTON
//==========================================================

generateChart.addEventListener("click", createChart);


//==========================================================
// CREATE CHART
//==========================================================

function createChart(){

    // Check if a dataset exists
    if(dataset.length === 0){

        alert("Please upload a CSV or Excel file.");

        return;

    }

    // Get selected columns
    let xColumn = xAxis.value;
    let yColumn = yAxis.value;
    let type = chartType.value;

    // Validation
    if(xColumn === "" || yColumn === ""){

        alert("Please select both X-Axis and Y-Axis.");

        return;

    }

    // Prepare chart data
    let chartData = prepareChartData(xColumn, yColumn);

    // Draw chart
    drawChart(type, chartData.labels, chartData.values);

}



//==========================================================
// PREPARE CHART DATA
//==========================================================

function prepareChartData(xColumn, yColumn){

    // Object for grouping values
    let groupedData = {};

    // Loop through every record
    dataset.forEach(function(row){

        // X Axis value
        let category = row[xColumn];

        // Y Axis value
        let value = Number(row[yColumn]);

        // Ignore invalid numbers
        if(isNaN(value)){

            return;

        }

        // First occurrence
        if(groupedData[category] === undefined){

            groupedData[category] = value;

        }

        // Add values together
        else{

            groupedData[category] += value;

        }

    });

    // Convert object into arrays
    let labels = Object.keys(groupedData);

    let values = Object.values(groupedData);

    return{

        labels:labels,

        values:values

    };

}



//==========================================================
// DRAW CHART
//==========================================================

function drawChart(type, labels, values){

    // Remove previous chart
    if(currentChart){

        currentChart.destroy();

    }

    // Get canvas context
    let ctx = chartCanvas.getContext("2d");


    //==============================
    // SCATTER CHART
    //==============================

    if(type === "scatter"){

        let scatterData = [];

        for(let i=0;i<labels.length;i++){

            scatterData.push({

                x:i + 1,

                y:values[i]

            });

        }

        currentChart = new Chart(ctx,{

            type:"scatter",

            data:{

                datasets:[{

                    label:"Scatter Plot",

                    data:scatterData

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        });

        return;

    }


    //==============================
    // BAR
    // LINE
    // PIE
    // DOUGHNUT
    // RADAR
    //==============================

    currentChart = new Chart(ctx,{

        type:type,

        data:{

            labels:labels,

            datasets:[{

                label:yAxis.value,

                data:values,

                borderWidth:2

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    display:true,

                    position:"top"

                }

            }

        }

    });

}


/*=========================================================
        UNIVERSAL CHART GENERATOR
        Version 1.0
        PART 3

        Topics Covered

        ✔ Clear Chart
        ✔ Reset Application
        ✔ Chart Colors
        ✔ Helper Functions
==========================================================*/


//==========================================================
// CHART COLORS
//==========================================================

const backgroundColors = [

    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#F97316",
    "#84CC16",
    "#EC4899",
    "#6366F1",
    "#14B8A6",
    "#EAB308"

];

const borderColors = [

    "#2563EB",
    "#059669",
    "#D97706",
    "#DC2626",
    "#7C3AED",
    "#0891B2",
    "#EA580C",
    "#65A30D",
    "#DB2777",
    "#4F46E5",
    "#0F766E",
    "#CA8A04"

];


//==========================================================
// IMPROVED DRAW CHART
//==========================================================

// Replace the drawChart() function in Part 2
// with this improved version.

function drawChart(type, labels, values){

    // Destroy previous chart
    if(currentChart){

        currentChart.destroy();

    }

    let ctx = chartCanvas.getContext("2d");



    //=====================================
    // SCATTER CHART
    //=====================================

    if(type === "scatter"){

        let scatterData = [];

        for(let i=0;i<labels.length;i++){

            scatterData.push({

                x:i+1,

                y:values[i]

            });

        }

        currentChart = new Chart(ctx,{

            type:"scatter",

            data:{

                datasets:[{

                    label:yAxis.value,

                    data:scatterData,

                    backgroundColor:"#3B82F6"

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{

                    title:{

                        display:true,

                        text:"Scatter Plot"

                    }

                }

            }

        });

        return;

    }



    //=====================================
    // OTHER CHARTS
    //=====================================

    currentChart = new Chart(ctx,{

        type:type,

        data:{

            labels:labels,

            datasets:[{

                label:yAxis.value,

                data:values,

                backgroundColor:backgroundColors,

                borderColor:borderColors,

                borderWidth:2,

                fill:false

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    display:true,

                    position:"top"

                },

                title:{

                    display:true,

                    text:

                    xAxis.value +

                    " vs " +

                    yAxis.value

                }

            }

        }

    });

}



//==========================================================
// CLEAR CHART BUTTON
//==========================================================

clearChart.addEventListener("click", clearDashboard);



//==========================================================
// CLEAR DASHBOARD
//==========================================================

function clearDashboard(){

    // Destroy chart

    if(currentChart){

        currentChart.destroy();

        currentChart=null;

    }

    // Reset dropdowns

    xAxis.selectedIndex=0;

    yAxis.selectedIndex=0;

    chartType.selectedIndex=0;

}



//==========================================================
// RESET FILE INPUTS
//==========================================================

function resetFiles(){

    csvFile.value="";

    excelFile.value="";

}



//==========================================================
// DISPLAY DATA INFORMATION
//==========================================================

function datasetInformation(){

    console.log("====================================");

    console.log("DATASET INFORMATION");

    console.log("====================================");

    console.log("Rows :",dataset.length);

    console.log("Columns :",Object.keys(dataset[0]).length);

    console.log("Column Names");

    console.table(Object.keys(dataset[0]));

}



//==========================================================
// INITIALIZE APPLICATION
//==========================================================

function initialize(){

    console.log("====================================");

    console.log("UNIVERSAL CHART GENERATOR");

    console.log("Version 1.0");

    console.log("Application Loaded Successfully");

    console.log("====================================");

}

initialize();