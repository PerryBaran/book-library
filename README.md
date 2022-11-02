# Book-Library

An Express.js API that interacts with a sequelize database via CRUD requests to store and interact with reader and book information.

Sequelize uses MySQL dialect for tests and Postgres for production.

Implements Test-Driven development using Mocha and Chai.

Created as part of the Manchester Codes full-stack web development boot-camp.

App hosted on [Render](https://render.com/) at https://book-library-f9gi.onrender.com.

## Table of Contents

1. [Dependencies](#dependencies)
2. [Setup](#setup)
3. [Commands](#commands)
4. [Routes](#routes)
5. [Attribution](#attribution)

## Dependencies

- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Dev Dependencies

- [MySQL2](https://www.npmjs.com/package/mysql2)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Mocha](https://www.npmjs.com/package/mocha)
- [Chai](https://www.npmjs.com/package/chai)
- [Supertest](https://www.npmjs.com/package/supertest)
- [Faker](https://www.npmjs.com/package/@faker-js/faker)
- [Sinon](https://www.npmjs.com/package/sinon)
- [Rewrire](https://www.npmjs.com/package/rewire)
- [Prettier](https://prettier.io/)

## Setup

### Install Dependencies

```
$ npm i
```

### Database

If you have [Docker](https://docs.docker.com/) installed, To set the database up, pull and run a MySQL image with:

```
$ docker run -d -p 3307:3306 --name book_library_mysql -e MYSQL_ROOT_PASSWORD=password mysql
```

### Environment variables

You will need to create a file to store your environment variables. These credentials allow you to connect to the database. Two environments will need to be created, one for production and one for testing.

Create a `.env` file in the root of the repo with the following values:

```
DB_PASSWORD=password
DB_NAME=book_library
DB_USER=root
DB_HOST=localhost
DB_PORT=3307
```

Create a `.env.test` file in the root of the repo with the following values:

```bash
DB_PASSWORD=password
DB_NAME=book_library_dev
DB_USER=root
DB_HOST=localhost
DB_PORT=3307
```

## Commands

To run the server use:

```
$ npm start
```

To run all tests use:

```
$ npm test
```

To only run unit tests use:

```
$ npm run unit-test
```

To run Prettier use:

```
$ npm run prettier
```

## Routes

<sub>? In Schema represents optional field</sub>

### /readers

| Method | Route               | Description                      | Schema (JSON)                                                                          |
| ------ | ------------------- | -------------------------------- | -------------------------------------------------------------------------------------- |
| POST   | /readers            | Creates new reader               | <pre>{<br /> "name": STRING,<br /> "email": STRING,<br /> "password": STRING<br />}    |
| GET    | /readers            | Returns all readers              | N/A                                                                                    |
| GET    | /readers/{readerId} | Returns reader of specified ID   | N/A                                                                                    |
| PATCH  | /readers/{readerId} | Updates reader with specified ID | <pre>{<br /> "name"?: STRING,<br /> "email"?: STRING,<br /> "password"?: STRING<br />} |
| DELETE | /readers/{readerId} | Deletes reader with specified ID | N/A                                                                                    |

### /books

| Method | Route           | Description                                                  | Schema (JSON)                                                                                                      |
| ------ | --------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| POST   | /books          | Creates new book                                             | <pre>{<br /> "title": STRING,<br /> "ISBN"?: STRING,<br /> "authorId": INTEGER,<br /> "genreId"?: INTEGER<br />}   |
| GET    | /books          | Returns all books and associated genres and authors          | N/A                                                                                                                |
| GET    | /books/{bookId} | Returns book of specified ID and associated genre and author | N/A                                                                                                                |
| PATCH  | /books/{bookId} | Updates book with specified ID                               | <pre>{<br /> "title"?: STRING,<br /> "ISBN"?: STRING,<br /> "authorId"?: INTEGER,<br /> "genreId"?: INTEGER<br />} |
| DELETE | /books/{bookId} | Deletes book with specified ID                               | N/A                                                                                                                |

### /authors

| Method | Route               | Description                                                    | Schema (JSON)                        |
| ------ | ------------------- | -------------------------------------------------------------- | ------------------------------------ |
| POST   | /authors            | Creates new author                                             | <pre>{<br /> "author": STRING<br />} |
| GET    | /authors            | Returns all authors and associated books and genres            | N/A                                  |
| GET    | /authors/{authorId} | Returns author of specified ID and associated books and genres | N/A                                  |
| PATCH  | /authors/{authorId} | Updates author with specified ID                               | <pre>{<br /> "author": STRING<br />} |
| DELETE | /authors/{authorId} | Deletes author with specified ID                               | N/A                                  |

### /genres

| Method | Route             | Description                                                    | Schema (JSON)                       |
| ------ | ----------------- | -------------------------------------------------------------- | ----------------------------------- |
| POST   | /genres           | Creates new genre                                              | <pre>{<br /> "genre": STRING<br />} |
| GET    | /genres           | Returns all genres and associated books and authors            | N/A                                 |
| GET    | /genres/{genreId} | Returns genre of specified ID and associated books and authors | N/A                                 |
| PATCH  | /genres/{genreId} | Updates genre with specified ID                                | <pre>{<br /> "genre": STRING<br />} |
| DELETE | /genres/{genreId} | Deletes genre with specified ID                                | N/A                                 |

## Attribution

Created by **Perry Baran**.
