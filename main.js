import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Bar Chart
// ////////////


// Visualization init
const xLabels = [];
const yValues = [];
const site = [];
const unsortedData = [];

// Parse csv data using D3
const csvLink = "/plasma-data.csv"
// const csvLink = "https://raw.githubusercontent.com/Solidago-01/GitHub-Hosted-Files/refs/heads/main/plasma-data.csv"
const data = await d3.text(csvLink); 

// Split rows on every line break
// Returns array of rows as strings, omits the first row (category names)
const table = data.split('\n').slice(1);

// Split each row string into separate values along the commas
// For each row, returns array of newly split values
table.forEach(row => {
    const column = row.split(',');

    // For each row, extract out only matching value at named column
    const siteName = column[0];
    const fishIdentification = column[1];
    const collectionDate = column[2];
    const sex = column[3];
    const age = column[4];
    const length = column[5];
    const weight = column[6];
    const PFOS = column[7];
    const PFDA = column[8];
    const PFUnA = column[9];
    const PFUoA = column[10];
    const PFOSA = column[11];
    const PFNA = column[12];
    const PFBA = column[13];
    const PFPeA = column[14];
    const PFOA = column[15];
    const totalPFAS = column[16];
    
    // Generate unsorted, binded data to eventually sort(), and resplit
    const unsortedDataPoint = [];
    unsortedDataPoint.push(collectionDate);
    unsortedDataPoint.push(Number(totalPFAS));
    unsortedDataPoint.push(siteName);
    unsortedData.push(unsortedDataPoint);
})


// Custom ascending sort for date time strings
const sortedData = unsortedData.sort(function(a, b) {
    // Convert the date strings to Date objects
    let dateA = new Date(a[0]);
    let dateB = new Date(b[0]);
  
    // Subtract the dates to get a value that is either negative, positive, or zero
    return dateA - dateB;
});

sortedData.forEach(dataPair => {
    const a = dataPair[0];
    xLabels.push(a);
    const b = dataPair[1];
    yValues.push(b);
    const c = dataPair[2];
    site.push(c);
})

const ctx = document.getElementById('myChart');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: xLabels,
    datasets: [{
      label: `Total PFAS`,
      data: yValues,
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        display: true,
        labelString: 'Your Title'
      }
    }
  }
});


// Scatter Plot
// ////////////


// Call data as array of objects
// Scatter plot will use array of objects
const data2 = await d3.csv(csvLink); 
// console.log(data3);

// Remove unwanted key/value pairs
data2.forEach(object => {
  delete object["Collection Date"];
  delete object["Length (mm)"];
  delete object["PFBA (ng/ml)"];
  delete object["PFDA (ng/ml)"];
  delete object["PFDoA (ng/ml)"];
  delete object["PFNA (ng/ml)"];
  delete object["PFOA (ng/ml)"];
  delete object["PFOS (ng/ml)"];
  delete object["PFOSA (ng/ml)"];
  delete object["PFPeA (ng/ml)"];
  delete object["PFUnA (ng/ml)"];
  delete object["Sex"];
  delete object["Site name "];
  delete object["Weight (gms)"];
  delete object["Fish identification"];

  // rename remaining keys "Age (years)" and "Total PFAS" to x and y
  object["x"] = object['Age (years)'];
  delete object['Age (years)'];
  object["y"] = object['Total PFAS'];
  delete object['Total PFAS'];
})

var ctx2 = document.getElementById("myChart2").getContext('2d');

var options = {responsive: true, 
    maintainAspectRatio: false, 
};


var myChart2 = new Chart(ctx2, {
    type: 'scatter',
    data: {
        datasets: [{
                label: 'Age (Years) vs Total PFAS', 
                data: data2, 
          borderColor: '#2196f3',      
          backgroundColor: '#2196f3', 
            }]
    },
    options: options
});


// Doughnut Graph
// //////////////


var swataraCreekCount = 0;
var southBranchMoorefieldCount = 0;
var westBranchMahantangoCreekCount = 0;
var pineCreekCount = 0;
var chillisquaqueCreekCount = 0;
var antietamCreekCount = 0;
var susquehannaRiverNearSelinsgroveCount = 0;
var southBranchPotomacPetersburgCount = 0;
var cheatRiverCount = 0;
var greenbrierRiverCaldwellCount = 0;
var greenbrierRiverSeebertCount = 0;

// console.log(site);

site.forEach(entry => {
  if (entry == "Swatara Creek") {
    swataraCreekCount += 1;
  } else if (entry == "South Branch Moorefield") {
    southBranchMoorefieldCount += 1;
  } else if (entry == "West Branch Mahantango Creek") {
    westBranchMahantangoCreekCount += 1;
  } else if (entry == "Pine Creek") {
    pineCreekCount += 1;
  } else if (entry == "Chillisquaque Creek") {
    chillisquaqueCreekCount += 1;
  } else if (entry == "Antietam Creek") {
    antietamCreekCount += 1;
  } else if (entry == "Susquehanna River near Selinsgrove") {
    susquehannaRiverNearSelinsgroveCount += 1;
  } else if (entry == "South Branch Potomac Petersburg") {
    southBranchPotomacPetersburgCount += 1;
  } else if (entry == "Cheat River") {
    cheatRiverCount += 1;
  } else if (entry == "Greenbrier River Caldwell") {
    greenbrierRiverCaldwellCount += 1;
  } else if (entry == "Greenbrier River Seebert") {
    greenbrierRiverSeebertCount += 1;
  }
})

const waterSiteNames = ["Swatara Creek", 
  "South Branch Moorefield", 
  "West Branch Mahantango Creek", 
  "Pine Creek", 
  "Chillisquaque Creek", 
  "Antietam Creek",
  "Susquehanna River near Selinsgrove",
  "South Branch Potomac Petersburg",
  "South Branch Potomac Petersburg",
  "Cheat River",
  "Greenbrier River Caldwell",
  "Greenbrier River Seebert"
]

const waterSiteSampleCounts = [swataraCreekCount, 
  southBranchMoorefieldCount, 
  westBranchMahantangoCreekCount,
  pineCreekCount,
  chillisquaqueCreekCount,
  antietamCreekCount,
  susquehannaRiverNearSelinsgroveCount,
  southBranchPotomacPetersburgCount,
  cheatRiverCount,
  greenbrierRiverCaldwellCount,
  greenbrierRiverSeebertCount
]

// console.log(waterSiteNames);
// console.log(waterSiteSampleCounts);

const coursesData = { 
  labels: waterSiteNames, 
  datasets: [{ 
    data: waterSiteSampleCounts, 
    backgroundColor: ['#FF6384', '#36A2EB', 
      '#FFCE56', '#4CAF50', '#9C27B0'], 
  }], 
}; 

const config = { 
  type: 'doughnut', 
  data: coursesData, 
  options: { 
    plugins: { 
      title: { 
        display: true, 
        text: 'Number of Samples Taken per Site', 
      }, 
    }, 
  }, 
}; 
const ctx3 = document.getElementById('myChart3').getContext('2d'); 
  
new Chart(ctx3, config); 

// fetch('https://www.sciencebase.gov/catalog/item/65e22659d34e5855ff4cf488?format=json') // api for the get request
//     .then(response => response.json())
//     .then(data => console.log(data));


fetch('https://www.sciencebase.gov/catalog/item/65e22659d34e5855ff4cf488?format=json', { 
  method: 'GET'
})
.then(function(response) { return response.json(); })
.then(function(data) {
  document.getElementById("studyTitle").innerHTML = data.title;
  document.getElementById("studyCitation").innerHTML = data.citation;
  document.getElementById("studyLink").href=data.link.url; 
  document.getElementById("studySummary").innerHTML = data.summary;
  document.getElementById("studyPurpose").innerHTML = data.purpose;
  document.getElementById("studyRights").innerHTML = `[The study] ${data.rights}`;
  // console.log(data)
});
