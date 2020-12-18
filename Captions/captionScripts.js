function updateListVal(target_id){
  var updateObj = document.getElementById(target_id);
  var target = updateObj.options[updateObj.selectedIndex].value;
  return target;
}

function genDBs() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("Database Initilized");
    }
  };
  xhttp.open("GET", "initializeDB.php", true);
  xhttp.send();
}

function pageLoad(){
  var t = 500
  var dt = 150
  console.log("pageLoad function running");
  genDBs();
  setTimeout(getImageTree,t);  
  // setTimeout(updateTripsWrapper,1000);
  setTimeout(getTripsDict,t+dt);
  setTimeout(genSideMenu,t+2*dt);  
}

function getTripsDict(){
  console.log("getTripsDict function running")
  tripsInfoDict = {};

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var tripsList = JSON.parse(this.responseText);
      //clear the existing elements
      for (i = 0; i < tripsList.length; i++) {
        id = tripsList[i]["id"]
        tripsInfoDict[id] = {"name":tripsList[i]["name"],"id":id}
      }
    }
  }   
  xhttp.open("GET", "getTrips.php", true);
  xhttp.send();
}

//Pulls the image tree files - a dictionary for trips, and one for days.
function getImageTree(){
  console.log("getImageTree3 function running");

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var imageDict = JSON.parse(this.responseText);
      var tripsDictTemp = {}
      var daysDictTemp = {}

      tripsDictJSON = imageDict["trips"];
      daysDictJSON = imageDict["days"];
      for (var key in tripsDictJSON){
      	tripsDictTemp[key] = JSON.parse(tripsDictJSON[key]);
      }
      for (var key in daysDictJSON){
      	daysDictTemp[key] = JSON.parse(daysDictJSON[key]);
      }
      tripsDict =tripsDictTemp ;
      daysDict = daysDictTemp;

      console.log("-tripsDict[3]: "+tripsDict[3]);
      console.log("-tripsDict[2]: "+tripsDict[2]);
      console.log("-daysDict[1]: "+daysDict[1]);
      console.log("-daysDict[1][0]: "+daysDict[1][0]);
    }
  }   
  xhttp.open("GET", "imageDicts.php", true);
  xhttp.send();
}

function genSideMenu(){
  var tag_id = "side-menu-1"
  var parentElement = document.getElementById(tag_id);
  var new_html = ""
  parentElement.innerHTML = ""
  console.log("genSideMenu function running")
  parentElement.innerHTML +="<div class = side-element>Trips</div>"
    for (var key in tripsDict){
      tmp = "<div class = side-element onclick=displayTrip(tag1,"+ String(key)+ ")>"
      tmp+= tripsInfoDict[key]["name"]
      tmp+= "</div>"
      new_html += tmp
    }
  parentElement.innerHTML = new_html
} 

// function updateTripsWrapper(){
//   tripsListID = "htmlTripsList";
//   daysListID  = "htmlDaysList";
//   imagesListID= "htmlImagesList";
//   console.log("updateTripsWrapper function running");
//   setTimeout(updateTripsList,1,tripsListID);
// }

// function tripsChange(){
//   console.log("tripsChange function running");
//   tripVal = updateListVal('htmlTripsList');
// }

function displayImage(result_tag,id) {
  var xhttp = new XMLHttpRequest();
  document.getElementById(result_tag).innerHTML = "";

  console.log("displayImage function running");
  console.log("-Displaying Image: "+id);
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
		var caption = JSON.parse(this.responseText);
		var responseString = "";
		var jsString = "";
    var cropString = "";
    crop_vals = JSON.parse(caption.crop_vals);

   //generating html string, in case cropping happens.
   if(crop_vals != "none"){
      cropString += "style = \"margin:";
      for (i=0;i<crop_vals.length;i++){
        cropString += " " + crop_vals[i] + "px";
      }
      cropString += ";\"";
    }

    jsString += "<div class = 'captionImage'>\n";
		jsString += caption.caption + "<br>\n";
    
		jsString += '<a href=UserData/' + caption.photoFile + ' target="_blank">';
    if(crop_vals != "none"){jsString += '<div class = "crop">';}
		jsString +=	'<img src = UserData/' + caption.photoFile + ' title = \"' + caption.title + '\" alt = \"' + caption.description + '\" ';
    jsString += cropString;
    jsString += '>\n';
    if(crop_vals != "none"){jsString += '</div>';}
		jsString += '</a></div>\n';

      // document.getElementById(result_tag).innerHTML = "Sucess Updating!\n"+responseString + "<br>" + jsString;
    document.getElementById(result_tag).innerHTML = jsString;
    }
  };
  // document.getElementById(result_tag).innerHTML = "imageCaptions.php?id="+id;
  xhttp.open("GET", "imageInfo.php?id="+id, true);
  xhttp.send();
}

function displayDay(result_tag,dayVal){
  var update_string = "Updating the day, I promise...";
  document.getElementById(result_tag).innerHTML=update_string
  console.log("displayDay function running");
  console.log("-day key: "+dayVal);
  var new_str = "";
  var new_tags = [];
  var description = "Description Pending";

  ///
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var jsonResponse = JSON.parse(this.responseText);
      description = jsonResponse.description;
      header = jsonResponse.header;

      new_str += "<div class = day>";
      new_str += "<h>"+header+"</h>"
      new_str += "<p>"+description+"</p>";
      imageIDs = daysDict[dayVal];
      console.log("--imageIds: "+imageIDs);
      for (i=0;i<imageIDs.length;i++){
      	// console.log("--imageIDs[i]"+imageIDs[i]);
        var current_tag = "image_"+imageIDs[i];
        new_str +="<div id="+current_tag+' class = "imageContainer"></div>';//add div to string.
        new_tags.push(current_tag);//add div tag to list, for later use. 
      }
      new_str += "</div>"
      document.getElementById(result_tag).innerHTML=new_str;//Add divs to existing HTML page. 

      for (i=0;i<new_tags.length;i++){
        var tag = new_tags[i];
        var tag_id = imageIDs[i]
        displayImage(tag,tag_id)
      }
    }
  }   
  xhttp.open("GET", "dayInfo.php?id="+dayVal, true);
  xhttp.send();
}

function displayTrip(result_tag,tripVal){
  var update_string = "Updating the trip, I promise...";
  document.getElementById(result_tag).innerHTML=update_string;
  console.log("displayTrip function running");
  console.log("-trip key: "+tripVal);
  console.log("-days: "+tripsDict[tripVal]);
  // console.log("-days[0]: "+daysDict[tripVal][0]);
  var new_str = "";
  var new_tags = [];
  var description = "Description Pending";

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var jsonResponse = JSON.parse(this.responseText);
      description = jsonResponse.description;
      header = jsonResponse.location;

      new_str += "<div class = trip>";
      new_str += "<h1>"+header+"</h1>"
      new_str += "<p>"+description+"</p>";
      dayIDs = tripsDict[tripVal]
      for (i=0;i<dayIDs.length;i++){
      	// console.log("--imageIDs[i]"+imageIDs[i]);
        var current_tag = "day_"+dayIDs[i];
        new_str +="<div id="+current_tag+' class = "dayContainer"> Temp day text here </div>';//add div to string.
        new_tags.push(current_tag);//add div tag to list, for later use. 
      }
      new_str += "</div>"
      document.getElementById(result_tag).innerHTML=new_str;//Add divs to existing HTML page. 

      for (i=0;i<new_tags.length;i++){
        var tag = new_tags[i];
        var tag_id = dayIDs[i];
        var images = daysDict[tag_id]; 
        console.log("images are: "+images[0])
        // displayDay(tag,tag_id,images);
        delay = 300*(i+1);
  		setTimeout(displayDay,delay,tag,tag_id);
      }
    }
  }   
  xhttp.open("GET", "tripInfo.php?id="+tripVal, true);
  xhttp.send();
}