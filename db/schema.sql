Drop Database If Exists BookBookDb;
Create Database BookBookDb;
USE BookBookDb;

/*Drop Table If Exists Categories;
Create Table Categories (
    id INT Auto_Increment,
    catName varchar(50),
    Primary Key (id)
);*/

DROP Table if Exists Books;
Create Table Books (
    id INT Auto_Increment,
    title varchar(50),
    author varchar(50),
    genre varchar(50),
    GbookId varchar(50),
    available boolean DEFAULT false,    
    checkedOut boolean DEFAULT false,
    Primary Key (id)  
);

DROP TABLE IF EXISTS Users;
CREATE TABLE Users (
    id INT Auto_Increment,
    name varchar(50),
    email varchar(50),
    secret CHAR(60) BINARY,    
    Primary Key (id)    
);

DROP TABLE IF EXISTS Owners;
CREATE TABLE Owners (
    id INT Auto_Increment,
    bookId INT NOT NULL,
    userId INT NOT NULL,
   CONSTRAINT FK_Owners_BookId FOREIGN KEY (bookId) REFERENCES Books(id),
    CONSTRAINT FK_Owners_UserId FOREIGN KEY (userId) REFERENCES Users(id),
    Primary Key (id)
);

DROP TABLE IF EXISTS WishList;
CREATE TABLE WishList (
    id INT Auto_Increment,
    bookId INT NOT NULL,
    userId INT NOT NULL,
    CONSTRAINT FK_WishList_BookId FOREIGN KEY (bookId) REFERENCES Books(id),
    CONSTRAINT FK_WishList_UserId FOREIGN KEY (userId) REFERENCES Users(id),
    Primary Key (id)
);





