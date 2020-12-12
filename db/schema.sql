Drop Database If Exists bookbookdb;
Create Database bookbookdb;
USE bookbookdb;

/*Drop Table If Exists Categories;
Create Table Categories (
    id INT Auto_Increment,
    catName varchar(50),
    Primary Key (id)
);*/

DROP Table if Exists books;
Create Table books (
    id INT Auto_Increment,
    title varchar(50),
    author varchar(50),
    genre varchar(50),
    gbookId varchar(50),
    available boolean DEFAULT FALSE,    
    checkedOut boolean DEFAULT FALSE,
    Primary Key (id)  
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT Auto_Increment,
    name varchar(50),
    email varchar(50),
    secret CHAR(60) BINARY,
    CONSTRAINT UC_users_email UNIQUE (id, email),  
    Primary Key (id)    
);

DROP TABLE IF EXISTS Owners;
CREATE TABLE Owners (
    id INT Auto_Increment,
    bookId INT NOT NULL,
    userId INT NOT NULL,
	CONSTRAINT FK_Owners_BookId FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE,
    CONSTRAINT FK_Owners_UserId FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,    
    Primary Key (id)
);

DROP TABLE IF EXISTS wishlist;
CREATE TABLE wishlist (
    id INT Auto_Increment,
    userId INT NOT NULL,
	title varchar(50),
    author varchar(50),
    genre varchar(50),
    gbookId varchar(50),
    CONSTRAINT FK_WishList_UserId FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    Primary Key (id)
);






