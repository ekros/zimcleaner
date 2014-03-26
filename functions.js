function getSpaceDetails(name, folders, total_size)
{
	var space_details = null;
	var labels = "<strong>" + name + " " + SPACE_USAGE + "</strong>";
	var bars = "";
	var colors = ["red", "blue", "coral", "green", "darkblue", "orange", "maroon", "olive", "lime", "purple"];
	var others_size = 0;

	// sort folders by size
	var tuples = [];
	var ordered_folders = {};

	for (var key in folders) tuples.push([key, folders[key]]);

	tuples.sort(function(a, b) {
	    a = a[1];
	    b = b[1];

	    return a > b ? -1 : (a < b ? 1 : 0);
	});

	for (var i = 0; i < tuples.length; i++) {
	    var key = tuples[i][0];
	    var value = tuples[i][1];

	    // do something with key and value
	    ordered_folders[key] = value;
	}

	// fill labels and bars with data
	for (var i in Object.keys(ordered_folders))
	{
		if (i > 9) 
		{
			others_size += ordered_folders[Object.keys(ordered_folders)[i]];
		}
		else
		{
			if (i == 0) var folder_name = "/"; // root folder
			else var folder_name = Object.keys(ordered_folders)[i].slice(Object.keys(ordered_folders)[i].indexOf("/", 1)).split(' ').join('_');
			var folder_label = folder_name + " " + bytesToSize(ordered_folders[Object.keys(ordered_folders)[i]]) + " (" + ((ordered_folders[Object.keys(ordered_folders)[i]]/total_size)*100).toFixed(1) + "%)";
			labels += " | <span style='color: " + colors[i] + "'>" + folder_label + "</span>";
			bars += "<div class='bar2' title='" + folder_label + "' style='float: left; width: " + (ordered_folders[Object.keys(ordered_folders)[i]]/total_size)*100 + "%; height: 20px; background-color:" + colors[i] + "; border: 0px'></div>";
		}
		// bars += (ordered_folders[Object.keys(ordered_folders)[i]]/total_size)*100;
		// bars += Object.keys(ordered_folders)[i] + " " + ordered_folders[Object.keys(ordered_folders)[i]] + "<br>";
	}
	// add other folders to the result
	var other_label = "Other " + bytesToSize(others_size) + " (" + ((others_size/total_size)*100).toFixed(1) + "%)";
	labels += " | <span style='color:black'>" + other_label + "</span>";
	bars += "<div class='bar2' title='" + other_label + "' style='float: left; width: " + ((others_size/total_size)*99).toFixed(1) + "%; height: 20px; background-color:black; border: 0px'></div>";
	space_details = labels + "<br>" + bars;

	return space_details;
};

function firstBarEffect()
{
	$(".bar1").hide();
	$(".bar1").show("slow");
}

function secondBarEffect()
{
	$(".bar2").hide();
	$(".bar2").show("slow");
}

// returns the date a year ago
function getAYearAgo()
{
       var today = new Date();
       var aYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds());
       return aYearAgo;
};

// transforms a size in bytes to other dimension
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[[i]];
};

