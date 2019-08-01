<?
header('Content-Type: application/json');
$servername = "127.0.0.1";
$username = "root";
$password = "password";
$db = "clarocity";

$conn = new mysqli($servername, $username, $password, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$opt = getopt(null, ["action:"]);
$action = $opt['action'];

$opt = getopt(null, ["data:"]);
$data = $opt['data'];

if ( !$action ) {
    $sql = "SELECT r.*, ".
            "GROUP_CONCAT(rs.price ORDER BY rs.date DESC) sale_amounts, ".
            "GROUP_CONCAT(rs.date ORDER BY rs.date DESC) sale_dates ".
        "FROM realties r LEFT JOIN sales rs on r.id = rs.realty_id GROUP BY r.id";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $resultSet[] = $row;
        }
        print json_encode($resultSet);
    } else {
        print '[]';
    }
} else {
    switch($action) {
        case 'addNew':
            $d = explode('|', $data);
            $sql = "INSERT INTO `realties` (`id`, `address`, `city`, `state`, `zip`) VALUES (NULL, '$d[0]', '$d[1]', '$d[2]', '$d[3]')";
        break;
        case 'delete':
            $sql = "DELETE FROM `realties` WHERE `id` IN ('$data')";
        break;
        case 'addSale':
            $d = explode('|', $data);
            $sql = "INSERT INTO `sales` (`id`, `date`, `price`, `realty_id`) VALUES (NULL, '$d[1]', '$d[2]', '$d[0]');";
        break;
        case 'edit':
            $d = explode('|', $data);
            $sql = "UPDATE `realties` SET `address` = '$d[1]', `city` = '$d[2]', `state` = '$d[3]', `zip` = '$d[4]' WHERE `id` = '$d[0]'";
        break;
    }

    if ( $result = $conn->query($sql) ) {
        print json_encode($result);
    } else {
        print $conn->error;
        print "\n$sql";
    }
    

}





$conn->close();
?>