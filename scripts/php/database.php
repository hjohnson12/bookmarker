<?php
    $dataSourceName = 'mysql:host=localhost;dbname=bookmarksdb';
    $username = 'user';
    $password = 'pa55word';

    try {
        $db = new PDO($dataSourceName, $username, $password);
        echo `<p>You're connected!</p>`;
    }
    catch (PDOException $e) {
        $error_message = $e->getMessage();
        echo "Error: " . $error_message;
        exit();
    }
?>