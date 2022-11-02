const { expect } = require('chai');
const { Book, Genre, Author } = require('../../src/models');
const {
  bookFactory,
  genreFactory,
  authorFactory,
} = require('../helpers/dataFactory');
const { appGet } = require('../helpers/requestHelpers');

describe('associations', () => {
  let authors;
  let genres;
  let books;

  before(async () => {
    try {
      await Author.sequelize.sync();
      await Book.sequelize.sync();
      await Genre.sequelize.sync();
    } catch (err) {
      throw new Error(err);
    }
  });

  beforeEach(async () => {
    try {
      authors = await Promise.all([
        Author.create(authorFactory()),
        Author.create(authorFactory()),
      ]);

      genres = await Promise.all([
        Genre.create(genreFactory()),
        Genre.create(genreFactory()),
      ]);

      books = await Promise.all([
        Book.create(
          bookFactory({ genreId: genres[0].id, authorId: authors[0].id })
        ),
        Book.create(
          bookFactory({ genreId: genres[0].id, authorId: authors[0].id })
        ),
        Book.create(
          bookFactory({ genreId: genres[1].id, authorId: authors[1].id })
        ),
      ]);
    } catch (err) {
      throw new Error(err);
    }
  });

  afterEach(async () => {
    try {
      await Author.destroy({ where: {} });
      await Book.destroy({ where: {} });
      await Genre.destroy({ where: {} });
    } catch (err) {
      throw new Error(err);
    }
  });

  describe('/books', () => {
    describe('GET /books', () => {
      it('returns associated genres', async () => {
        try {
          const { status, body } = await appGet(`/books`);

          expect(status).to.equal(200);

          body.forEach((book) => {
            const expectedGenre = genres.find(
              (genre) => genre.id === book.GenreId
            );

            expect(book.GenreId).to.equal(expectedGenre.id);
            expect(book.Genre.genre).to.equal(expectedGenre.genre);
          });
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns associated authors', async () => {
        try {
          const { status, body } = await appGet(`/books`);

          expect(status).to.equal(200);

          body.forEach((book) => {
            const expectedAuthor = authors.find(
              (author) => author.id === book.AuthorId
            );

            expect(book.AuthorId).to.equal(expectedAuthor.id);
            expect(book.Author.author).to.equal(expectedAuthor.author);
          });
        } catch (err) {
          throw new Error(err);
        }
      });
    });

    describe('GET /books/:id', () => {
      it('returns associated genre', async () => {
        try {
          const book = books[0];
          const genre = genres[0];
          const { status, body } = await appGet(`/books/${book.id}`);

          expect(status).to.equal(200);
          expect(body.GenreId).to.equal(genre.id);
          expect(body.Genre.id).to.equal(genre.id);
          expect(body.Genre.genre).to.equal(genre.genre);
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns associated author', async () => {
        try {
          const book = books[0];
          const author = authors[0];
          const { status, body } = await appGet(`/books/${book.id}`);

          expect(status).to.equal(200);
          expect(body.AuthorId).to.equal(author.id);
          expect(body.Author.id).to.equal(author.id);
          expect(body.Author.author).to.equal(author.author);
        } catch (err) {
          throw new Error(err);
        }
      });
    });
  });

  describe('/genres', () => {
    describe('GET /genres', () => {
      it('returns associated books and authors', async () => {
        try {
          const { status, body } = await appGet('/genres');

          expect(status).to.equal(200);

          body.forEach((genre) => {
            const booksArray = books.filter(
              (book) => book.GenreId === genre.id
            );

            expect(booksArray.length).to.equal(genre.Books.length);

            genre.Books.forEach((book) => {
              const expectedBook = books.find((item) => item.id === book.id);
              const expectedAuthor = authors.find(
                (author) => author.id === book.AuthorId
              );

              expect(expectedBook.title).to.equal(book.title);
              expect(expectedBook.ISBN).to.equal(book.ISBN);
              expect(expectedAuthor.author).to.equal(book.Author.author);
            });
          });
        } catch (err) {
          throw new Error(err);
        }
      });
    });

    describe('GET /genres/:id', () => {
      it('return associated books and authors', async () => {
        try {
          const genre = genres[0];
          const { status, body } = await appGet(`/genres/${genre.id}`);
          const filteredBooks = books.filter(
            (book) => book.GenreId === genre.id
          );

          expect(status).to.equal(200);
          expect(body.Books.length).to.equal(filteredBooks.length);

          body.Books.forEach((book) => {
            const expectedBook = filteredBooks.find(
              (item) => item.id === book.id
            );
            const expectedAuthor = authors.find(
              (author) => author.id === expectedBook.AuthorId
            );

            expect(book.title).to.equal(expectedBook.title);
            expect(book.ISBN).to.equal(expectedBook.ISBN);
            expect(book.Author.author).to.equal(expectedAuthor.author);
          });
        } catch (err) {
          throw new Error(err);
        }
      });
    });
  });

  describe('/authors', () => {
    describe('GET /authors', () => {
      it('returns associated books and genre', async () => {
        try {
          const { status, body } = await appGet('/authors');

          expect(status).to.equal(200);

          body.forEach((author) => {
            const booksArray = books.filter(
              (book) => book.AuthorId === author.id
            );

            expect(booksArray.length).to.equal(author.Books.length);

            author.Books.forEach((book) => {
              const expectedBook = books.find((item) => item.id === book.id);
              const expectedGenre = genres.find(
                (genre) => genre.id === book.GenreId
              );

              expect(expectedBook.title).to.equal(book.title);
              expect(expectedBook.ISBN).to.equal(book.ISBN);
              expect(expectedGenre.genre).to.equal(book.Genre.genre);
            });
          });
        } catch (err) {
          throw new Error(err);
        }
      });
    });

    describe('GET /authors/:id', async () => {
      it('returns associated books and genres', async () => {
        try {
          const author = authors[0];
          const { status, body } = await appGet(`/authors/${author.id}`);
          const filteredBooks = books.filter(
            (book) => book.AuthorId === author.id
          );

          expect(status).to.equal(200);
          expect(body.Books.length).to.equal(filteredBooks.length);

          body.Books.forEach((book) => {
            const expectedBook = books.find((item) => item.id === book.id);
            const expectedGenre = genres.find(
              (genre) => genre.id === book.GenreId
            );

            expect(book.title).to.equal(expectedBook.title);
            expect(book.ISBN).to.equal(expectedBook.ISBN);
            expect(book.Genre.genre).to.equal(expectedGenre.genre);
          });
        } catch (err) {
          throw new Error(err);
        }
      });
    });
  });
});
