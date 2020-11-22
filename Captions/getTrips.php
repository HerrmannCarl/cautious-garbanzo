<?php
$servername = "db5000775650.hosting-data.io";
$username = "dbu910176";
$password = "ThisIsAWeakPassword!1";
$dbname = "dbs701200";

// Create connection
$conn = new mysqli($servername, $username, $password,$dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Get the requested image / caption fromthe URL
$query1 = "SELECT * FROM Trips";

$stmt = $conn->prepare($query1);
$stmt->execute();

$result1 = $stmt->get_result();

$daysList = array();
if ($result1->num_rows > 0) {
  // output data of each row
  while($row = $result1->fetch_assoc()) {
  	$output=array("id"=>$row["id"],"name"=>$row["name"]);
  	array_push($daysList,$output);
  }
}
$output_JSON = json_encode($daysList);
echo $output_JSON;

$stmt->close();
$conn->close();
?>
