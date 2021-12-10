<?php
    require_once('database.php');

    $category = filter_input(INPUT_POST, 'categoryName');
    $bookmarkName = filter_input(INPUT_POST, 'bookmarkName');
    $bookmarkUrl = filter_input(INPUT_POST, 'bookmarkUrl');

    $query = 'INSERT INTO bookmarks
                (categoryName, bookmarkName, bookmarkUrl)
                VALUES (:categoryName, :bookmarkName, :bookmarkUrl)';
    
    $statement = $db->prepare($query);
    $statement->bindValue(':categoryName', $category);
    $statement->bindValue(':bookmarkName', $bookmarkName);
    $statement->bindValue(':bookmarkUrl', $bookmarkUrl);
    $statement->execute();
    $statement->closeCursor(); // cursor is thing that moves through the db

    echo 'Bookmark ' . $bookmarkName . ' created successfully with ID ' . $db->lastInsertId();
?>