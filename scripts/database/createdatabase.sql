DROP DATABASE IF EXISTS bookmarksdbdev;
CREATE DATABASE bookmarksdbdev;
USE bookmarksdbdev; -- MySQL Command

-- Create TABLE
CREATE TABLE categories (
  categoryID       INT(11)        NOT NULL   AUTO_INCREMENT,
  categoryName     VARCHAR(255)   NOT NULL,
  PRIMARY KEY (categoryID)
);

CREATE TABLE bookmarks (
  bookmarkID        INT(11)        NOT NULL   AUTO_INCREMENT,
  categoryName      VARCHAR(10)    NOT NULL,
  bookmarkName      VARCHAR(255)   NOT NULL,
  bookmarkUrl       VARCHAR(255)   NOT NULL,
  PRIMARY KEY (bookmarkID)
);

INSERT INTO categories VALUES
(1, 'Default Category'),
(2, 'Category2');

INSERT INTO bookmarks VALUES
(1, 'Default Category', 'bookmark', 'www.test.com');

GRANT SELECT, INSERT, DELETE, UPDATE
ON bookmarksdbdev.*
TO someuser@localhost
IDENTIFIED BY 'pa55word';