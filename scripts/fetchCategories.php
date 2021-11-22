<?php
    require_once('database.php');

    $queryCategoryes = 'SELECT * FROM categories';

    $execStatement = $db->prepare($queryCategoryes);
    $execStatement->execute();

    $categoryList = $execStatement->fetchAll();
    $execStatement->closeCursor(); // cursor is thing that moves through the db

    $categories = [];

    foreach($categoryList as $category) {
        // Add to array        
        array_push($categories, (object)[
            'categoryID' => $category['categoryID'],
            'categoryName' => $category['categoryName'],
        ]);
    }
    
    // Return array as JSON objs
    echo json_encode($categories);
?>