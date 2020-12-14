/* Use the database*/
USE bookbookdb;

/*Insert Test Users*/
INSERT into users (name, email, secret) VALUES ("John Travolta", "travoltaDances@yahoo.com","$2b$10$chimlCdP.3Wqdkf2BdgdAut18k2HxP7v.FnzcZ4lXMnNXK2bAC6Xm");
INSERT into users (name, email, secret) VALUES ("Woody Allen", "ThetoolGuy123@aol.com","$2b$10$chimlCdP.3Wqdkf2BdgdAut18k2HxP7v.FnzcZ4lXMnNXK2bAC6Xm");
INSERT into users (name, email, secret) VALUES ("Alex Morgan", "soccerGirl2011@yahoo.com","$2b$10$chimlCdP.3Wqdkf2BdgdAut18k2HxP7v.FnzcZ4lXMnNXK2bAC6Xm");

/*Insert Test Books*/
INSERT into books (title, author, genre, gbookId, available, checkedOut) VALUES ('test title', 'test author', 'mystery', '2', false, false);
INSERT into books (title, author, genre, gbookId, available, checkedOut) VALUES ('The Big Sleep', 'Raymond Chandler', 'Mystery', '6132$', false, false);
INSERT into books (title, author, genre, gbookId, available, checkedOut) VALUES ('The Maltese Falcon', 'Dashiell Hammet', 'Mystery', '#32$', true, false);

####################################################################################################

/*Insert owners with multiple books*/
INSERT into owners (bookId, userId) VALUES (
(SELECT id FROM books WHERE id =1),
(SELECT id FROM users WHERE id =2)
);

INSERT into owners (bookId, userId) VALUES (
(SELECT id FROM books WHERE id =3),
(SELECT id FROM users WHERE id =2)
);

INSERT into owners (bookId, userId) VALUES (
(SELECT id FROM books WHERE id =2),
(SELECT id FROM users WHERE id =2)
);

INSERT into owners (bookId, userId) VALUES (
(SELECT id FROM books WHERE id =1),
(SELECT id FROM users WHERE id =3)
);


########################################
/*Inserting into wishlist (TBD how this will actually function)*/
INSERT into wishlist (userId, title, author, genre, gbookId) VALUES (
(SELECT id FROM users WHERE id = 2),
"The Big Sleep", "Raymond Chandler", "Mystery", "1234"
);



########################################


/* Queries to check values in workbench
Select * from books;
SELECT * FROM users;	
Select * from owners;
Select * from wishlist;
*/