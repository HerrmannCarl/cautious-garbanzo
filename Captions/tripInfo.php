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

$query1 = "SELECT * FROM Trips WHERE id = (?)";

$stmt = $conn->prepare($query1);
$stmt->bind_param("i", $id);
$stmt->execute();

$result1 = $stmt->get_result();
$row1 = $result1->fetch_assoc();

$output = array("id"=>$row1["id"],"create_date"=>$row1["create_date"],"datecode"=>$row1["dateCode"],"location"=>$row1["location"],"days"=>$row1["days"],"description"=>$row1["description"]);
$output_JSON = json_encode($output);
echo $output_JSON;

$stmt->close();
$conn->close();
?>