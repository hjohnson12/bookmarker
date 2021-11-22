<?php
    require_once('database.php');

    $queryCategoryes = 'SELECT * FROM categories';

    $execStatement = $db->prepare($queryCategoryes);
    $execStatement->execute();

    $categoryList = $execStatement->fetchAll();
    $execStatement->closeCursor(); // cursor is thing that moves through the db
?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <title>Categories</title>
        <meta charset="utf-8">
    </head>
    <body>
        <h1>Category List</h1>
        <?php
            foreach($categoryList as $category) {
                echo $category['categoryID'] . ': ' . $category['categoryName']. '<br>';
            }
        ?>
    </body>
</html>