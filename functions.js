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

// returns the date X years ago
function getYearsAgo(years)
{
       var today = new Date();
       var yearsAgo = new Date(today.getFullYear() - years, today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds());
       return yearsAgo;
};

function toDateStr(date)
{
	var month = date.getMonth() + 1;
	return date.getDate() + "/" + month + "/" + date.getFullYear();
};

// transforms a size in bytes to other dimension
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[[i]];
};

function empty_trash()
{
        zimtransfer_HandlerObject.prototype._submitSOAPRequestJSON('FolderAction', 'zimbraMail', {"op":"empty","id":"3","recursive":true});
}

function empty_drafts()
{
        zimtransfer_HandlerObject.prototype._submitSOAPRequestJSON('FolderAction', 'zimbraMail', {"op":"empty","id":"6","recursive":true});
}

function empty_briefcase()
{
        zimtransfer_HandlerObject.prototype._submitSOAPRequestJSON('FolderAction', 'zimbraMail', {"op":"empty","id":"16","recursive":true});
}


function getResponseSize(response)
{
        var result_size = 0;

        //called with every property and it's value
        function process(key,value) {
          if (key == 's')
          {
            result_size += value;
          }
        };
        function traverse(o,func) {
          for (var i in o) {
            func.apply(this,[i,o[i]]);
            if (typeof(o[i])=="object") {
              //going on step down in the object tree!!
              traverse(o[i],func);
            }
          }
                                                                                                                                                                                                            };
        
                                                                                                                                                                                                                    //that's all... no magic, no bloated framework
        traverse(response, process);
        return result_size;
};
        
function getResponseIds(response)
{
  var idArray = new Array();
  var convArray = response.c;

        // iterate over conversations
  for (var i in convArray)
  {
    idArray.push(convArray[i].id);
  }
  return idArray;
};

String.prototype.beginsWith = function (string) {
    return(this.indexOf(string) === 0);
};
