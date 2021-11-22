<?php
    require("database.php");

    // $name = filter_input(INPUT_POST, 'categoryName');

    $queryBookmarks = 'SELECT * FROM bookmarks';

    $execStatement = $db->prepare($queryBookmarks);
    $execStatement->execute();

    $bookmarksList = $execStatement->fetchAll();
    $execStatement->closeCursor(); // cursor is thing that moves through the db

    $bookmarks = [];

    foreach($bookmarksList as $bookmark) {
        // Add to array        
        array_push($bookmarks, (object)[
            'bookmarkID' => $bookmark['bookmarkID'],
            'categoryName' => $bookmark['categoryName'],
            'bookmarkName' => $bookmark['bookmarkName'],
            'bookmarkUrl' => $bookmark['bookmarkUrl'],
        ]);
    }
    
    // Return array as JSON objs
    echo json_encode($bookmarks);
?>