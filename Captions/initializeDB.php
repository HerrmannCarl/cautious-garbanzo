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

// Clear sql table for Days
$sql = "DROP TABLE Days";
if ($conn->query($sql) === TRUE) {
  echo "Table Days deleted successfully<br>";
} else {
  echo "Error deleting table: " . $conn->error . "<br>";
}

// sql to create table for Captions
$sql = "CREATE TABLE Captions (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
photoFile VARCHAR(50) NOT NULL,
caption VARCHAR(240) NOT NULL,
title VARCHAR(240) NOT NULL,
description VARCHAR(240) NOT NULL,
crop_vals VARCHAR(240) NOT NULL,
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
name VARCHAR(100) NOT NULL,
datecode VARCHAR(240) NOT NULL,
days VARCHAR(100) NOT NULL,
create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";
if ($conn->query($sql) === TRUE) {
  echo "Table Trips created successfully<br>";
} else {
  echo "Error creating table: " . $conn->error . "<br>";
}

// sql to create table "trips"
$sql = "CREATE TABLE Days (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
tdate VARCHAR(50) NOT NULL,
startLocation VARCHAR(100) NOT NULL,
finishLocation VARCHAR(100) NOT NULL,
photos VARCHAR(100) NOT NULL,
create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";
if ($conn->query($sql) === TRUE) {
  echo "Table Days created successfully<br>";
} else {
  echo "Error creating table: " . $conn->error . "<br>";
}


////Insert "captions" data into database
//Get config data out of json for "captions"
$json_string = file_get_contents("captiondb.json");
$decoded_json = json_decode($json_string, true);
$decoded_data = $decoded_json["captions"];

echo "decoded json: " . $decoded_json["captions"][0]."<br>";
var_dump($decoded_json["captions"][0]["crop"]);
echo "<br>\n";

// var_dump($decoded_data);

$stmt = $conn->prepare("INSERT INTO Captions (photoFile, caption, title, description,crop_vals) VALUES (?, ?, ?, ?,?)");
$stmt->bind_param("sssss", $photoFile, $caption, $title, $description, $crop_vals);

foreach ($decoded_json["captions"] as $iter) {
  $photoFile = $iter["photoFile"];
  $caption = $iter["caption"];
  $title = $iter["title"];
  $description = $iter["description"];
  $crop_vals = json_encode($iter["crop"]);
  $stmt->execute();
}

$stmt->close();

////Insert "trips" data into database
//Get config data out of json for "trips"
$json_string = file_get_contents("captiondb.json");
$decoded_json = json_decode($json_string, true);
$decoded_data = $decoded_json["trips"];

// var_dump($decoded_data);
$stmt = $conn->prepare("INSERT INTO Trips (name,location, datecode, days) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $trip_name,$location, $datecode, $days);

foreach ($decoded_data as $iter) {
  $trip_name = $iter["name"];
  $location = $iter["location"];
  $datecode = $iter["dateCode"];
  $days = json_encode($iter["days"]);
  $stmt->execute();
}

$stmt->close();

////Insert "days" data into database
//Get config data out of json for "trips"
$json_string = file_get_contents("captiondb.json");
$decoded_json = json_decode($json_string, true);
$decoded_data = $decoded_json["days"];

// var_dump($decoded_data);
$stmt = $conn->prepare("INSERT INTO Days (tdate, startLocation, finishLocation, photos) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $tdate, $startLocation,$finishLocation,$photos);

echo "-------<br>\n";
echo "Starting days insert <br>\n";

foreach ($decoded_data as $iter) {
  $tdate = $iter["date"];
  $startLocation = $iter["startLocation"];
  $finishLocation = $iter["finishLocation"];
  $photos = json_encode($iter["photos"]);
  $stmt->execute();
  echo "-date: " . $tdate . "<br>\n";
  echo "photos list: " . $photos . "<br>\n";
  echo "start location: " . $startLocation . "<br>\n";
  echo "finish location: " . $finishLocation . "<br>\n";
}

echo "-------<br>\n";
$stmt->close();


//checking Caption results
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
  echo "0 results<br>";
}

//checking Trip results
$sql = "SELECT * FROM Trips ORDER BY create_date";
$result = $conn->query($sql);

//print results
echo "Printing trip results<br>\n";
if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    echo "id: ". $row["id"] . " - create_date: " . $row["create_date"]. " - location: " . $row["location"]. " - date code: " . $row["datecode"]. "<br>";
  }
} else {
  echo "0 results<br>";
}

//checking Day results
$sql = "SELECT * FROM Days ORDER BY create_date";
$result = $conn->query($sql);

//print results
echo "Printing Day results<br>\n";
if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    echo "id: ". $row["id"] . " - create_date: " . $row["create_date"]. " - Start Location: " . $row["startLocation"]. " - Finish Location: " . $row["finishLocation"]." - trip date: " . $row["tdate"]. " - photos: " . $row["photos"]. "<br>";
  }
} else {
  echo "0 results<br>";
}


$conn->close();

?>

</body>
</html>