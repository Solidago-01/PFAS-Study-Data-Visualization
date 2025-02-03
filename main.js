import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
console.log("d3 import successful");

// Create Array of Colors to Use in Charts
const colors = ['#5fb1f4', '#5f66f4', '#5ff4ed', '#f4d65f', '#f48c5f', '#5ff4a5'];

// Vertical Bar Chart
// ////////////

// Visualization Init
const xLabels = [];
const yValues = [];
const site = [];
const unsortedData = [];

// Parse CSV Data Using D3
// const data = await d3.text("/plasma-data.csv"); 
// console.log("first d3 parse successful");
// console.log(data);

// let data = await fetch("/plasma-data.csv")
// .then((response) => response.text())
// .then((data) => {
//   return data
// })
// .catch((error) => {
//   console.log(error)
// });

async function getPlasmaDataAsString() {
  // console.log('calling');
  const data = await d3.text("/plasma-data.csv");
  // return content
  // Expected output: "resolved"

  // Split Rows On Every Line Break
  // Returns array of rows as strings, omits the first row (category names)
  const table = data.split('\n').slice(1);

  // Split Row Strings Into Separate Values Along Commas
  // For each row, returns array of newly split values
  table.forEach(row => {
    const column = row.split(',');

    // Per Row, Extract Only Matching Value at Named Column
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
    
    // Generate Unsorted, Binded Data to Sort(), and Resplit
    const unsortedDataPoint = [];
    unsortedDataPoint.push(collectionDate);
    unsortedDataPoint.push(Number(totalPFAS));
    unsortedDataPoint.push(siteName);
    unsortedData.push(unsortedDataPoint);
})

// Custom Ascending Sort for Date/Time Strings
const sortedData = unsortedData.sort(function(a, b) {
    // Convert Date Strings to Date Objects
    let dateA = new Date(a[0]);
    let dateB = new Date(b[0]);
  
    // Subtract the Dates for Value that is Either Negative, Positive, or Zero
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

const ctx = document.getElementById('verticalBarChart');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: xLabels,
    datasets: [{
      label: `Total PFAS`,
      data: yValues,
      borderWidth: 1,
      borderColor: colors[3],      
      backgroundColor: colors[3], 
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
}

getPlasmaDataAsString();
// console.log(data);

console.log("new test fetch sucessful, data assigned");

// // Split Rows On Every Line Break
// // Returns array of rows as strings, omits the first row (category names)
// const table = data.split('\n').slice(1);

// // Split Row Strings Into Separate Values Along Commas
// // For each row, returns array of newly split values
// table.forEach(row => {
//     const column = row.split(',');

//     // Per Row, Extract Only Matching Value at Named Column
//     const siteName = column[0];
//     const fishIdentification = column[1];
//     const collectionDate = column[2];
//     const sex = column[3];
//     const age = column[4];
//     const length = column[5];
//     const weight = column[6];
//     const PFOS = column[7];
//     const PFDA = column[8];
//     const PFUnA = column[9];
//     const PFUoA = column[10];
//     const PFOSA = column[11];
//     const PFNA = column[12];
//     const PFBA = column[13];
//     const PFPeA = column[14];
//     const PFOA = column[15];
//     const totalPFAS = column[16];
    
//     // Generate Unsorted, Binded Data to Sort(), and Resplit
//     const unsortedDataPoint = [];
//     unsortedDataPoint.push(collectionDate);
//     unsortedDataPoint.push(Number(totalPFAS));
//     unsortedDataPoint.push(siteName);
//     unsortedData.push(unsortedDataPoint);
// })

// // Custom Ascending Sort for Date/Time Strings
// const sortedData = unsortedData.sort(function(a, b) {
//     // Convert Date Strings to Date Objects
//     let dateA = new Date(a[0]);
//     let dateB = new Date(b[0]);
  
//     // Subtract the Dates for Value that is Either Negative, Positive, or Zero
//     return dateA - dateB;
// });

// sortedData.forEach(dataPair => {
//     const a = dataPair[0];
//     xLabels.push(a);
//     const b = dataPair[1];
//     yValues.push(b);
//     const c = dataPair[2];
//     site.push(c);
// })

// const ctx = document.getElementById('verticalBarChart');

// new Chart(ctx, {
//   type: 'bar',
//   data: {
//     labels: xLabels,
//     datasets: [{
//       label: `Total PFAS`,
//       data: yValues,
//       borderWidth: 1,
//       borderColor: colors[3],      
//       backgroundColor: colors[3], 
//     }]
//   },
//   options: {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       y: {
//         beginAtZero: true,
//         display: true,
//         labelString: 'Your Title'
//       }
//     }
//   }
// });


// Scatter Plot
// ////////////

// Call Data as Array of Objects
// Scatter plot will use array of objects

async function drawScatterPlot() {


  const data2 = await d3.csv("/plasma-data.csv"); 
  console.log(data2);
  console.log("second d3 parse successful");
  
  // Remove Unwanted Key/Value Pairs
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
  
    // Rename Remaining Keys "Age (years)" and "Total PFAS" to "x" and "y"
    object["x"] = object['Age (years)'];
    delete object['Age (years)'];
    object["y"] = object['Total PFAS'];
    delete object['Total PFAS'];
  })
  
  var ctx2 = document.getElementById("scatterChart").getContext('2d');
  
  var myChart2 = new Chart(ctx2, {
      type: 'scatter',
      data: {
          datasets: [{
                  label: 'Age (Years) vs Total PFAS', 
                  data: data2, 
            borderColor: colors[2],      
            backgroundColor: colors[2], 
              }]
      },
      options: {
        responsive: true, 
        maintainAspectRatio: false, 
      }
  });
};
drawScatterPlot();



// Doughnut Graph
// //////////////

async function drawDoughnutGraph() {


  // Init Sample Count for Each Site
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
  
  // Increment Site Count for Each Entry in Data
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
  
  // Create Array of Site Names for Use on Display
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
  
  // Create Array of Sample Totals
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
  
  const coursesData = { 
    labels: waterSiteNames, 
    datasets: [{ 
      data: waterSiteSampleCounts, 
      backgroundColor: colors
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
  const ctx3 = document.getElementById('doughnutChart').getContext('2d'); 
  new Chart(ctx3, config);
}

drawDoughnutGraph();


// Horizontal Bar Chart
// ////////////////////

async function drawHorizontalBarChart() {


  const tissueDataText = await d3.text("/tissue-data.csv");
  console.log("third d3 parse successful");
  const numberOfColumns = (await d3.csv("/tissue-data.csv")).length;
  console.log("fourth d3 parse successful");
  
  const results = [];
  
  function getAverageColumnValue(column) {
  
    try {
      
      // Split the contents into rows
      const rows = tissueDataText.split('\n').slice(1);
    
      
      // Initialize variables for sum and count
      let sum = 0;
      let count = 0;
      
      // Loop through each row and add the value in the specified column to the sum
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i].split(',');
        if (row[column]) {
          sum += parseFloat(row[column]);
          count++;
        }
      }
      
      // Calculate and return the average
      let average = sum / count;
      results.push(average);
      // console.log(results);
    
    } catch (error) {
      // Log the error and return 0
      console.error(error);
      // return 0;
    }
  };
  
  // Need to use this to execute function below 28 times
  for (let i = 0; i < numberOfColumns; i++) {
    // console.log(`Iteration is #${i}`)
    getAverageColumnValue(i);
  }
  
  const isolatedEntriesByCommas = tissueDataText.split(',');
  // console.log(isolatedEntriesByCommas);
  const columnLabels = isolatedEntriesByCommas.slice(0,numberOfColumns);
  // console.log(columnLabels);
  // console.log(results);
  
  const resultsExcludingNAN = [];
  resultsExcludingNAN.push(results[13], results[14], results[16], results[18], results[19], results[21], results[22]);
  // console.log(resultsExcludingNAN);
  
  const resultsLabelsExcludingNAN = [];
  resultsLabelsExcludingNAN.push(columnLabels[13], columnLabels[14], columnLabels[16], columnLabels[18], columnLabels[19], columnLabels[21], columnLabels[22]);
  // console.log(resultsLabelsExcludingNAN);
  
  
  
  const ctx4 = document.getElementById('horizontalBarChart');
  
  new Chart(ctx4, {
    type: 'bar',
    data: {
      labels: resultsLabelsExcludingNAN,
      datasets: [{
        label: `Average Result Total`,
        data: resultsExcludingNAN,
        borderWidth: 1,
        borderColor: colors[4],      
        backgroundColor: colors[4], 
      }]
    },
    options: {
      indexAxis: 'y',
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
}

drawHorizontalBarChart();




// Load Available Text Content from JSON
// /////////////////////////////////////

async function updateText() {
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
  });
  console.log("Final fetch successful");

}

updateText();
