<?php
    require_once('database.php');

    $name = filter_input(INPUT_POST, 'categoryName');

    $query = 'INSERT INTO categories
                (categoryName)
                VALUES (:name)';
    
    $statement = $db->prepare($query);
    $statement->bindValue(':name', $name);
    $statement->execute();
    $statement->closeCursor(); // cursor is thing that moves through the db

    echo 'Category ' . $name . ' created successfully with ID ' . $db->lastInsertId();

?>