import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Create Array of Colors to Use in Charts
const colors = ['#5fb1f4', '#5f66f4', '#5ff4ed', '#f4d65f', '#f48c5f', '#5ff4a5'];


// ///////////////////////
// Draw Vertical Bar Chart
// ///////////////////////

async function drawVerticalBarChart() {
  
  // Bar Chart Helpers Init
  const xLabels = [];
  const yValues = [];
  const site = [];
  const unsortedData = [];

  try {

    // Parse Data with D3 as Text Block
    const verticalBarChartData = await d3.text("plasma-data.csv");
  
    // Split Rows On Every Line Break
    // Returns array of rows as strings, omits the first row (category names)
    const table = verticalBarChartData.split('\n').slice(1);
  
    // Split Row Strings Into Separate Values Along Commas
    // For each row, returns array of newly split values
    table.forEach(row => {
      const column = row.split(',');
  
      // Per Row, Extract Only Matching Value at Named Column
      const siteName = column[0];
      const collectionDate = column[2];
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
  
  // Apply Sorted Data to Axis
  sortedData.forEach(dataPair => {
      const a = dataPair[0];
      xLabels.push(a);
      const b = dataPair[1];
      yValues.push(b);
      const c = dataPair[2];
      site.push(c);
  })
  
  // Locate DOM Element
  const verticalBarChart = document.getElementById('verticalBarChart');
  
  // Draw Vertical Bar Chart with Chart.js
  new Chart(verticalBarChart, {
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
  catch (error) {
    console.error('Fetch error:', error);
  }
}

drawVerticalBarChart();

// /////////////////
// Draw Scatter Plot
// /////////////////

async function drawScatterPlot() {

  try {

    // Parse Data with D3 as Array of Objects
    const scatterPlotData = await d3.csv("plasma-data.csv"); 
    
    // Remove Unwanted Key/Value Pairs
    scatterPlotData.forEach(object => {
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
    
    // Get DOM Element
    var scatterChart = document.getElementById("scatterChart").getContext('2d');
    
    // Draw Scatter with Chart.js
    new Chart(scatterChart, {
        type: 'scatter',
        data: {
            datasets: [{
                    label: 'Age (Years) vs Total PFAS', 
                    data: scatterPlotData, 
              borderColor: colors[2],      
              backgroundColor: colors[2], 
                }]
        },
        options: {
          responsive: true, 
          maintainAspectRatio: false, 
        }
    });
  }
  catch (error) {
    console.error('Fetch error:', error);
  }
};
drawScatterPlot();


// ///////////////////
// Draw Doughnut Graph
// ///////////////////

async function drawDoughnutGraph() {
  
  try {

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
  
    // Create Array of Sample Counts Cooresponding to Above
    const waterSiteSampleCounts = [
      16,73,66,64,14,61,18,20,10,10,10,10
    ]
    
    // Define Doughnut Chart Config (Alternate Broken Out Syntax)
    const config = { 
      type: 'doughnut', 
      data: { 
        labels: waterSiteNames, 
        datasets: [{ 
          data: waterSiteSampleCounts, 
          backgroundColor: colors
        }], 
      }, 
      options: { 
        plugins: { 
          title: { 
            display: true, 
            text: 'Number of Samples Taken per Site', 
          }, 
        }, 
      }, 
    };
    
    // Get DOM Element
    const doughnutChart = document.getElementById('doughnutChart').getContext('2d'); 

    // Draw Doughnut Chart with Chart.js
    new Chart(doughnutChart, config);
  }
  catch (error) {
    console.error('Fetch error:', error);
  }
}

drawDoughnutGraph();


// /////////////////////////
// Draw Horizontal Bar Chart
// /////////////////////////

async function drawHorizontalBarChart() {

  try {

    // Parse data with D3 as Text Block
    const tissueDataText = await d3.text("tissue-data.csv");

    // Define Length of Data and Init Results Array
    const numberOfColumns = (await d3.csv("tissue-data.csv")).length;
    const results = [];
    
    function getAverageColumnValue(column) {
    
      try {
        
        // Split the Contents Into Rows
        const rows = tissueDataText.split('\n').slice(1);
      
        // Initialize Variables for Sum and Count (to Average)
        let sum = 0;
        let count = 0;
        
        // Loop Through Each Row and Add the Value in the Specified Column to the Sum
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i].split(',');
          if (row[column]) {
            sum += parseFloat(row[column]);
            count++;
          }
        }
        
        // Calculate and Return the Average
        let average = sum / count;
        results.push(average);
      
      } catch (error) {
        console.error(error);
      }
    };
    
    // Execute Function Below 28 Times
    for (let i = 0; i < numberOfColumns; i++) {
      getAverageColumnValue(i);
    }
    
    // Separate Data by Commas
    const isolatedEntriesByCommas = tissueDataText.split(',');
    const columnLabels = isolatedEntriesByCommas.slice(0,numberOfColumns);
    
    // Remove Columns and Labels with NaN Values
    const resultsExcludingNAN = [];
    resultsExcludingNAN.push(results[13], results[14], results[16], results[18], results[19], results[21], results[22]);
    const resultsLabelsExcludingNAN = [];
    resultsLabelsExcludingNAN.push(columnLabels[13], columnLabels[14], columnLabels[16], columnLabels[18], columnLabels[19], columnLabels[21], columnLabels[22]);
    
    // Get DOM Element
    const horizontalBarChart = document.getElementById('horizontalBarChart');
    
    // Draw Horizontal Bar Chart with Chart.js
    new Chart(horizontalBarChart, {
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

  catch (error) {
    console.error('Fetch error:', error);
  }

}
drawHorizontalBarChart();

// /////////////////////////////////////
// Load Available Text Content from JSON
// /////////////////////////////////////
// Note: Some text content was staged statically due to absence from JSON

async function updateText() {
  try {
    // Get Text from Original JSON Listing and Add to DOM
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

  }

  catch (error) {
    console.error('Fetch error:', error);
  }

}

updateText();
