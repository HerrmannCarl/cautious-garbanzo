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