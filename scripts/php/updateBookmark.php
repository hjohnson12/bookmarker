<?php
    require("database.php");

    $category = filter_input(INPUT_POST, 'categoryName');
    $oldName = filter_input(INPUT_POST, 'oldName');
    $oldUrl = filter_input(INPUT_POST, 'oldUrl');
    $bookmarkName = filter_input(INPUT_POST, 'bookmarkName');
    $bookmarkUrl = filter_input(INPUT_POST, 'bookmarkUrl');

    $updateQuery = 'UPDATE bookmarks
                    SET bookmarkName = :bookmarkName,
                        bookmarkUrl = :bookmarkUrl
                    WHERE categoryName = :categoryName
                    AND bookmarkName = :oldName
                    AND bookmarkUrl = :oldUrl';

    $execStatement = $db->prepare($updateQuery);
    $execStatement->bindValue(':categoryName', $category);
    $execStatement->bindValue(':oldName', $oldName);
    $execStatement->bindValue(':oldUrl', $oldUrl);
    $execStatement->bindValue(':bookmarkName', $bookmarkName);
    $execStatement->bindValue(':bookmarkUrl', $bookmarkUrl);
    $execStatement->execute();
    $execStatement->closeCursor(); // cursor is thing that moves through the db

    $count = $execStatement->rowCount();
    if ($count > 0) {
        echo "Updated successfully!";
    } else {
        echo "Update unsuccessful! Item not found.";
    }

?>