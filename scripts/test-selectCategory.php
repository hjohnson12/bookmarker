<?php
    require_once('database.php');

    $name = filter_input(INPUT_POST, 'categoryName');
    
    $selectQuery = 'SELECT * FROM categories
                    WHERE categories.categoryName = :categoryName';
    $statement2 = $db->prepare($selectQuery);
    $statement2->bindValue(':categoryName', $name);
    $statement2->execute();

    $category = $statement2->fetch();

    $statement2->closeCursor(); // cursor is thing that moves through the db
    
    echo $category['categoryName'];
?>