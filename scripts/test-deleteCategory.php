<?php
    require("database.php");

   try {
        $name = filter_input(INPUT_POST, 'categoryName');

        $deleteQuery = 'DELETE FROM categories
                            WHERE categoryName = :categoryName';
        $execStatement = $db->prepare($deleteQuery);
        $execStatement->bindValue(':categoryName', $name);
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
