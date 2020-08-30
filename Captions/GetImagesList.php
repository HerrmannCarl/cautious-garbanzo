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
$id = $_REQUEST["id"];

$query1 = "SELECT * FROM Captions WHERE day_id = (?)";

$stmt = $conn->prepare($query1);
$stmt->bind_param("i", $id);
$stmt->execute();
$result1 = $stmt->get_result();


$imagesList = array();
if($result1->num_rows > 0){
	while($row = $result1->fetch_assoc()){
		$output=array("id"=>$row["id"],"create_date"=>$row["create_date"]);
		$output_JSON = json_encode($output);
		array_push($imagesList,$output);
	}
}

$output_JSON = json_encode($imagesList);

echo $output_JSON;

// $result1 = $stmt->get_result();
// $row1 = $result1->fetch_assoc();

// $output = array("id"=>$row1["id"],"create_date"=>$row1["create_date"]);
// $output_JSON = json_encode($output);
// echo $output_JSON;

$stmt->close();
$conn->close();
?>