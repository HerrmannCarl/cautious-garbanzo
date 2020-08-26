function genDBs(result_tag) {
  var xhttp = new XMLHttpRequest();
  document.getElementById(result_tag).style = "background-color:lightgreen" ;
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     document.getElementById(result_tag).innerHTML = "Database initilized";
    }
  };
  xhttp.open("GET", "initializeDB.php", true);
  xhttp.send();
}

function getCaption(result_tag,id) {
  var xhttp = new XMLHttpRequest();
  document.getElementById(result_tag).innerHTML = "Trying to update...";
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
		var caption = JSON.parse(this.responseText);
		var responseString = "";
		var jsString = "";
    var cropString = "";
    crop_vals = JSON.parse(caption.crop_vals)

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
    
		jsString += '<a href=' + caption.photoFile + ' target="_blank">';
    if(crop_vals != "none"){jsString += '<div class = "crop">';}
		jsString +=	'<img src = ' + caption.photoFile + ' title = \"' + caption.title + '\" alt = \"' + caption.description + '\" ';
    jsString += cropString;
    jsString += '>\n';
    if(crop_vals != "none"){jsString += '</div>';}
		jsString += '</a></div>\n';

      // document.getElementById(result_tag).innerHTML = "Sucess Updating!\n"+responseString + "<br>" + jsString;
    document.getElementById(result_tag).innerHTML = jsString;
    }
  };
  // document.getElementById(result_tag).innerHTML = "imageCaptions.php?id="+id;
  xhttp.open("GET", "imageCaptions.php?id="+id, true);
  xhttp.send();
}

function getCaptions(result_tag,ids) {
  var new_str = ""
  var new_strs = [];
  new_str += "<div class = trip>";
  for (i = 0; i < ids.length; i++) {
  	var current_tag="photo_"+ids[i];
    new_str += "<div id="+ current_tag + ' class="imageContainer" ></div>';
    new_strs.push(current_tag);
  }
  new_str += "</div>";
  document.getElementById(result_tag).innerHTML=new_str;
  
  console.log("new_strings is: "+ new_strs)
  for (i=0;i<new_strs.length;i++){
  	tag = new_strs[i];
  	var tag_id = ids[i];
  	getCaption(tag,tag_id);
  }
}

function updateListVal(target_id){
  var updateObj = document.getElementById(target_id);
  var target = updateObj.options[updateObj.selectedIndex].value;
  return target;
}

function getImagesList(day_id){
  // return testytest;

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var jsonResponse = JSON.parse(this.responseText);
      var photo_list;
      photo_list = JSON.parse(jsonResponse.photos);
      return photo_list;
    }
  }   
  xhttp.open("GET", "imagesDays.php?id="+day_id, true);
  xhttp.send();
}

function getImages(result_tag,id) {
  var xhttp = new XMLHttpRequest();
  document.getElementById(result_tag).innerHTML = "Trying to update...<br>\n";
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    var jsonResponse = JSON.parse(this.responseText);
    var responseString = "";
    var jsString = "";
    jsString += "Trying Update. Really.  I'm trying<br>\n";
    jsString += "id: " + jsonResponse.id + "<br>\n";
    jsString += "date: " + jsonResponse.tdate + "<br>\n";
    jsString += "startLocation: " + jsonResponse.startLocation + "<br>\n";
    jsString += "finishLocation: " + jsonResponse.finishLocation + "<br>\n";
    jsString += "photos: " + JSON.parse(jsonResponse.photos) + "<br>\n";

      // document.getElementById(result_tag).innerHTML = "Sucess Updating!\n"+responseString + "<br>" + jsString;
    document.getElementById(result_tag).innerHTML = jsString;
    return false;
    }
  };
  // document.getElementById(result_tag).innerHTML = "imageCaptions.php?id="+id;
  xhttp.open("GET", "imagesDays.php?id="+id, true);
  xhttp.send();
}

function updateImagesList(sourceListID,destListID) {
  var newElements = "";
  var parentElement = document.getElementById(destListID);
  var imagesList=[1,2,3];
  var day_id;

  day_id = updateListVal(sourceListID);

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var jsonResponse = JSON.parse(this.responseText);
      var imagesList = JSON.parse(jsonResponse.photos);

      //clear the existing elements
      parentElement.innerHTML = "";
      for (i = 0; i < imagesList.length; i++) {
        newElements+="<option value=\"" + imagesList[i] + "\">" + "Image "+ (i+1) + "</option>" ;
      }
      document.getElementById(destListID).innerHTML = newElements //add options to target dropdown
      imageVal = updateListVal(destListID)//update selection in target dropdown
    }
  }   
  xhttp.open("GET", "imagesDays.php?id="+day_id, true);
  xhttp.send();
}

function updateDaysList(sourceListID,destListID) {
  var newElements = "";
  var parentElement = document.getElementById(destListID);
  var daysList=[1,2,3];
  var trip_id;
  trip_id = updateListVal(sourceListID);

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var jsonResponse = JSON.parse(this.responseText);
      var daysList = JSON.parse(jsonResponse.days);

      //clear the existing elements
      parentElement.innerHTML = "";
      for (i = 0; i < daysList.length; i++) {
        newElements+="<option value=\"" + daysList[i] + "\">" + "Day "+ (i+1) + "</option>" ;
      }
      document.getElementById(destListID).innerHTML = newElements //add options to target dropdown
      daysVal = updateListVal(destListID)//update selection in target dropdown
    }
  }   
  xhttp.open("GET", "daysTrips.php?id="+trip_id, true);
  xhttp.send();
}

function getTrips(destListID) {
  var newElements = "";
  var parentElement = document.getElementById(destListID);
  var tripsList=[1,2,3];

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var tripsList = JSON.parse(this.responseText);
      //clear the existing elements
      parentElement.innerHTML = "";
      for (i = 0; i < tripsList.length; i++) {
        newElements+="<option value=\"" + tripsList[i]["id"] + "\">" + tripsList[i]["name"] + "</option>" ;
      }
      document.getElementById(destListID).innerHTML = newElements //add options to target dropdown
      tripsVal = updateListVal(destListID)//update selection in target dropdown
    }
  }   
  xhttp.open("GET", "getTrips.php", true);
  xhttp.send();
}


function genTrip(result_tag,tripsVal){
  var update_string = "Updating the trip, I promise...";
  document.getElementById(result_tag).innerHTML = update_string;
}

function genDay(result_tag,daysVal){
  var update_string = "Updating the day, I promise...";
  document.getElementById(result_tag).innerHTML = update_string;
}
