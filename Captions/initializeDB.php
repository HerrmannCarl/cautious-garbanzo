<!DOCTYPE html>
<html>
<body>

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
echo "Connected successfully <br>";

// Clear sql table for Captions
$sql = "DROP TABLE Captions";
if ($conn->query($sql) === TRUE) {
  echo "Table Captions deleted successfully<br>";
} else {
  echo "Error deleting table: " . $conn->error . "<br>";
}

// Clear sql table for Trips
$sql = "DROP TABLE Trips";
if ($conn->query($sql) === TRUE) {
  echo "Table Trips deleted successfully<br>";
} else {
  echo "Error deleting table: " . $conn->error . "<br>";
}

// sql to create table for Captions
$sql = "CREATE TABLE Captions (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
photoFile VARCHAR(50) NOT NULL,
caption VARCHAR(240) NOT NULL,
create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";
if ($conn->query($sql) === TRUE) {
  echo "Table Captions created successfully<br>";
} else {
  echo "Error creating table: " . $conn->error . "<br>";
}

// sql to create table "trips"
$sql = "CREATE TABLE Trips (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
location VARCHAR(50) NOT NULL,
datecode VARCHAR(240) NOT NULL,
create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";
if ($conn->query($sql) === TRUE) {
  echo "Table trips created successfully<br>";
} else {
  echo "Error creating table: " . $conn->error . "<br>";
}

//Get config data out of json for "captions"
$json_string = file_get_contents("captiondb.json");
$decoded_json = json_decode($json_string, true);
$decoded_data = $decoded_json["captions"];

// var_dump($decoded_data);

$stmt = $conn->prepare("INSERT INTO Captions (photoFile, caption) VALUES (?, ?)");
$stmt->bind_param("ss", $photoFile, $caption);

foreach ($decoded_json["captions"] as $iter) {
  $photoFile = $iter["photoFile"];
  $caption = $iter["caption"];
  $stmt->execute();
}

$stmt->close();

//Get config data out of json for "trips"
$json_string = file_get_contents("captiondb.json");
$decoded_json = json_decode($json_string, true);
$decoded_data = $decoded_json["trips"];

// var_dump($decoded_data);

$stmt = $conn->prepare("INSERT INTO Trips (location, dateCode) VALUES (?, ?)");
$stmt->bind_param("ss", $location, $datecode);

foreach ($decoded_data as $iter) {
  $location = $iter["location"];
  $datecode = $iter["dateCode"];
  $stmt->execute();
}

$stmt->close();

//Check that the captions data is as it should be
$sql = "SELECT * FROM Captions ORDER BY create_date";
$result = $conn->query($sql);

//print results
echo "printing caption results<br>";
if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    echo "id: ". $row["id"] . " - create_date: " . $row["create_date"]. " - photoFile: " . $row["photoFile"]. " - Caption: " . $row["caption"]. "<br>";
  }
} else {
  echo "0 results";
}

$sql = "SELECT * FROM Trips ORDER BY create_date";
$result = $conn->query($sql);

//print results
echo "printing trip results<br>";
if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    echo "id: ". $row["id"] . " - create_date: " . $row["create_date"]. " - location: " . $row["location"]. " - date code: " . $row["datecode"]. "<br>";
  }
} else {
  echo "0 results";
}

$conn->close();

?>

</body>
</html>