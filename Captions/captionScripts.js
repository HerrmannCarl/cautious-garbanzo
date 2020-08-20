function genDBs(result_tag) {
  var xhttp = new XMLHttpRequest();
  document.getElementById("button_1").style = "background-color:green" ;
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     document.getElementById(result_tag).innerHTML = "Database initilized";
    }
  };
  xhttp.open("GET", "initializeDB.php", true);
  xhttp.send();
}

// function captionText(id){
// 	var
// }

function getCaption(result_tag,id) {
  var xhttp = new XMLHttpRequest();
  document.getElementById(result_tag).innerHTML = "Trying to update...";
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
		var caption = JSON.parse(this.responseText);
		var responseString = "";
		var jsString = "";
		// responseString += "id: " + caption.id;
		// responseString += "date created: " + caption.create_date;
		// responseString += "photoFile: " + caption.photoFile;
		// responseString += "caption: " + caption.caption;

		// jsString += '<link rel="stylesheet" href="captions.css">';
		jsString += "<div class = 'captionImage'>\n";
		jsString += caption.caption + "<br>\n";
		jsString += '<a href=' + caption.photoFile + ' target="_blank">';
		jsString +=	'<img src = ' + caption.photoFile + ' title = ' + caption.caption + ' alt = ' + caption.caption + ' width = "400">\n';
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
  
  console.log("got this far 1")
  for (i=0;i<new_strs.length;i++){
  	tag = new_strs[i];
  	var tag_id = ids[i];
    console.log("got this far 1 - tag is:"+tag)
    console.log("got this far 1 - var is:"+tag_id)
  	getCaption(tag,tag_id);
  }
}



