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

$tripsList = array();
$tripsDict = array();
if ($result1->num_rows > 0) {
  // output data of each row
  while($row = $result1->fetch_assoc()) {
  	$tripId = $row["id"];
  	$tripsDict[$tripId] = $row["days"];
  	// echo json_encode($row);
  	// echo "<br>";
  }
}

$query1 = "SELECT * FROM Days";
$stmt = $conn->prepare($query1);
$stmt->execute();
$result1 = $stmt->get_result();

$daysList = array();
$daysDict = array();
if ($result1->num_rows > 0) {
  // output data of each row
  while($row = $result1->fetch_assoc()) {
  	$daysId = $row["id"];
  	$daysDict[$daysId] = $row["photos"];
  	// echo json_encode($row);
  	// echo "<br>";
  }
}

$output = array();
$output["trips"]=$tripsDict;
$output["days"]= $daysDict;

$output_JSON = json_encode($output);
echo $output_JSON;

$stmt->close();
$conn->close();
?>
