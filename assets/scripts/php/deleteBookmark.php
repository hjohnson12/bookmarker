<?php
    require("database.php");

   try {
        $category = filter_input(INPUT_POST, 'categoryName');
        $bookmarkName = filter_input(INPUT_POST, 'bookmarkName');
        $bookmarkUrl = filter_input(INPUT_POST, 'bookmarkUrl');

        $deleteQuery = 'DELETE FROM bookmarks
                            WHERE categoryName = :categoryName
                            AND bookmarkName = :bookmarkName
                            AND bookmarkUrl = :bookmarkUrl';
        $execStatement = $db->prepare($deleteQuery);
        $execStatement->bindValue(':categoryName', $category);
        $execStatement->bindValue(':bookmarkName', $bookmarkName);
        $execStatement->bindValue(':bookmarkUrl', $bookmarkUrl);
        $execStatement->execute();

        $execStatement->closeCursor(); // cursor is thing that moves through the db

        $count = $execStatement->rowCount();
        if ($count > 0) {
            echo "Deleted successfully!";
        }
        else {
            echo "Deleted unsuccessfully! Item not found.";
        }
   }
   catch (PDOException $e) {
       echo $e->getMessage();
   }
