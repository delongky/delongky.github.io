// Use D3 to get data from json file
d3.json("samples.json").then((data) => {
    console.log(data);

// Create dropdown list with ID #'s: update all plots anytime ae new sample is selected
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset");
  // Assign names list in dataset to variable
  var subjectID = data.names;
  // use for loop through all ID's on list & add to dropdown
  for (var i = 0; i < subjectID.length; i++) {
    dropdownMenu.append("option").text(subjectID[i]);
  } // end for loop & addition of all ID's to dropdown

  d3.select("#selDataset").on("change", optionChanged);

  function optionChanged() {

    // Create Dashboard: use object.entries to display each key-value pair from the metadata JSON object
      var dashboard = d3.select("#sample-metadata");
      dashboard.html("")
      Object.entries(metadata).forEach(([key,value]) => {
        console.log(key, value);
        var row = dashboard.append("ul");
        row.text(`${key}: ${value}`);
      }); // ends forEach


    // Set variables for bar & bubble chart arrays
    var otuIDs = data.samples[0].otu_ids;
    var sampleValues = data.samples[0].sample_values;
    var otuLabels = data.samples[0].otu_labels;

    // Create a horizontal bar chart to display the top 10 OTUs found in that individual
    //  SEE D3-07   
    //  Create the Trace
      var barTrace = {
        x: sampleValues,
        y: otuIDs.slice(0, 10).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        type: "bar",
        name: "Top 10 OTUs",
        orientation: "h"
      }; // end trace
    
      // Create the data array for the plot
      var data = [barTrace];
    
      // Define the plot layout
      var layout = {
        title: "Top 10 OTU for Individual",
        xaxis: { title: "Values" },      
        yaxis: { title: "OTU ID" },
      }; // end layout
    
      // Plot the chart to a div tag with id "bar"
      Plotly.newPlot("bar", data, layout);

    // Create a bubble chart that displays each sample
      var bubbleTrace = {
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
        color: otuIDs,  
        size: sampleValues
        } // end marker
      }; // end trace
      
      var data = [bubbleTrace];
      
      var layout = {
        title: 'Marker Size',
        showlegend: false,
        height: 600,
        width: 1000
      }; // end layout
      // Plot the chart to a div tag with id "bubble"
      Plotly.newPlot('bubble', data, layout);
  }; // ends optionChanged function
}); // end Promise