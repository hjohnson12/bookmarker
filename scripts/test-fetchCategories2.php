<?php
    require_once('database.php');

    $queryCategoryes = 'SELECT * FROM categories';

    $execStatement = $db->prepare($queryCategoryes);
    $execStatement->execute();

    $categoryList = $execStatement->fetchAll();
    $execStatement->closeCursor(); // cursor is thing that moves through the db
?>