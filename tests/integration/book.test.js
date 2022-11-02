const { expect } = require('chai');
const { Book, Author } = require('../../src/models');
const { bookFactory, authorFactory } = require('../helpers/dataFactory');
const {
  appPost,
  appGet,
  appPatch,
  appDelete,
} = require('../helpers/requestHelpers');

describe('/books', () => {
  let author;

  before(async () => {
    try {
      await Author.sequelize.sync();
      await Book.sequelize.sync();
    } catch (err) {
      throw new Error(err);
    }
  });

  beforeEach(async () => {
    try {
      author = await Author.create(authorFactory());
    } catch (err) {
      throw new Error(err);
    }
  });

  afterEach(async () => {
    try {
      await Author.destroy({ where: {} });
      await Book.destroy({ where: {} });
    } catch (err) {
      throw new Error(err);
    }
  });

  describe('with no records in the database', () => {
    describe('POST /books', () => {
      it('creates a new book in the database', async () => {
        try {
          const data = bookFactory({ authorId: author.id });
          const { status, body } = await appPost('/books', data);
          const newBookRecord = await Book.findByPk(body.id, {
            raw: true,
          });

          expect(status).to.equal(201);
          expect(body.title).to.equal(data.title);
          expect(newBookRecord.title).to.equal(data.title);
          expect(newBookRecord.ISBN).to.equal(data.ISBN);
        } catch (err) {
          throw new Error(err);
        }
      });

      describe('title', () => {
        it('must contain a title', async () => {
          try {
            const data = bookFactory({ title: null, authorId: author.id });
            const { status, body } = await appPost('/books', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('Must provide a book title');
          } catch (err) {
            throw new Error(err);
          }
        });

        it('title cannot be empty', async () => {
          try {
            const data = bookFactory({ title: '', authorId: author.id });
            const { status, body } = await appPost('/books', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('The book title cannot be empty');
          } catch (err) {
            throw new Error(err);
          }
        });
      });

      describe('authorId', () => {
        it('must contain an authorId of a valid author', async () => {
          try {
            const data = bookFactory({ authorId: null });
            const { status, body } = await appPost('/books', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('Book must have an author');
          } catch (err) {
            throw new Error(err);
          }
        });
      });

      describe('ISBN', () => {
        it('must be unique', async () => {
          try {
            const data = bookFactory({
              ISBN: '978-1-1234-1234-1',
              authorId: author.id,
            });
            await appPost('/books', data);
            const { status, body } = await appPost('/books', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('ISBN must be unique');
          } catch (err) {
            throw new Error(err);
          }
        });

        it('can be valid ISBN13', async () => {
          try {
            const data = bookFactory({
              ISBN: '978-1-1234-1234-1',
              authorId: author.id,
            });
            const { status } = await appPost('/books', data);

            expect(status).to.equal(201);
          } catch (err) {
            throw new Error(err);
          }
        });

        it('can be valid ISBN10', async () => {
          try {
            const data = bookFactory({
              ISBN: '0-7960-0165-0',
              authorId: author.id,
            });
            const { status } = await appPost('/books', data);

            expect(status).to.equal(201);
          } catch (err) {
            throw new Error(err);
          }
        });

        it('can be ISBN13 without dashes', async () => {
          try {
            const data = bookFactory({
              ISBN: '9781123412341',
              authorId: author.id,
            });
            const { status } = await appPost('/books', data);

            expect(status).to.equal(201);
          } catch (err) {
            throw new Error(err);
          }
        });

        it('can be ISBN10 without dashes', async () => {
          try {
            const data = bookFactory({
              ISBN: '0796001650',
              authorId: author.id,
            });
            const { status } = await appPost('/books', data);

            expect(status).to.equal(201);
          } catch (err) {
            throw new Error(err);
          }
        });

        it('cannot be a numeric string containing less than 10 numbers', async () => {
          try {
            const data = bookFactory({
              ISBN: '079600165',
              authorId: author.id,
            });
            const { status, body } = await appPost('/books', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('ISBN must be of valid format');
          } catch (err) {
            throw new Error(err);
          }
        });

        it('cannot be a numeric string containing more than 13 numbers', async () => {
          try {
            const data = bookFactory({
              ISBN: '97811234123413',
              authorId: author.id,
            });
            const { status, body } = await appPost('/books', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('ISBN must be of valid format');
          } catch (err) {
            throw new Error(err);
          }
        });

        it('cannot be a numeric string containing 11 or 12 numbers', async () => {
          try {
            const data1 = bookFactory({
              ISBN: '97845678901',
              authorId: author.id,
            });
            const data2 = bookFactory({
              ISBN: '978456789012',
              authorId: author.id,
            });
            const { status: status11, body: body11 } = await appPost(
              '/books',
              data1
            );
            const { status: status12, body: body12 } = await appPost(
              '/books',
              data2
            );

            expect(status11).to.equal(500);
            expect(body11.error[0]).to.equal('ISBN must be of valid format');
            expect(status12).to.equal(500);
            expect(body12.error[0]).to.equal('ISBN must be of valid format');
          } catch (err) {
            throw new Error(err);
          }
        });

        it('cannot contain any non numeric characters', async () => {
          try {
            const data = bookFactory({
              ISBN: '978-1-1234-1a34-1',
              authorId: author.id,
            });
            const { status, body } = await appPost('/books', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('ISBN must be of valid format');
          } catch (err) {
            throw new Error(err);
          }
        });

        it('cannot start with anything other than 978 or 979 for ISBN13', async () => {
          try {
            const data = bookFactory({
              ISBN: '976-1-1234-1434-1',
              authorId: author.id,
            });
            const { status, body } = await appPost('/books', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('ISBN must be of valid format');
          } catch (err) {
            throw new Error(err);
          }
        });

        it('cannot contain more than 4 dashes', async () => {
          try {
            const data = bookFactory({
              ISBN: '978-1-1234-14-34-1',
              authorId: author.id,
            });
            const { status, body } = await appPost('/books', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('ISBN must be of valid format');
          } catch (err) {
            throw new Error(err);
          }
        });

        it('cannot contain less than 4 but more than 0 dashes', async () => {
          try {
            const data = bookFactory({
              ISBN: '978-1-123414-341',
              authorId: author.id,
            });
            const { status, body } = await appPost('/books', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('ISBN must be of valid format');
          } catch (err) {
            throw new Error(err);
          }
        });
      });
    });
  });

  describe('with records in the database', () => {
    let books;

    beforeEach(async () => {
      try {
        books = await Promise.all([
          Book.create(bookFactory({ authorId: author.id })),
          Book.create(bookFactory({ authorId: author.id })),
          Book.create(bookFactory({ authorId: author.id })),
        ]);
      } catch (err) {
        throw new Error(err);
      }
    });

    describe('GET /books', () => {
      it('gets all books records', async () => {
        try {
          const { status, body } = await appGet('/books');

          expect(status).to.equal(200);
          expect(body.length).to.equal(3);

          body.forEach((book) => {
            const expected = books.find((item) => item.id === book.id);

            expect(book.title).to.equal(expected.title);
            expect(book.ISBN).to.equal(expected.ISBN);
          });
        } catch (err) {
          throw new Error(err);
        }
      });
    });

    describe('GET /books/:id', () => {
      it('gets books record by id', async () => {
        try {
          const book = books[0];
          const { status, body } = await appGet(`/books/${book.id}`);

          expect(status).to.equal(200);
          expect(body.title).to.equal(book.title);
          expect(body.genre).to.equal(book.genre);
          expect(body.ISBN).to.equal(book.ISBN);
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns a 404 if the book does not exist', async () => {
        try {
          const { status, body } = await appGet('/books/12345');

          expect(status).to.equal(404);
          expect(body.error).to.equal('The book could not be found.');
        } catch (err) {
          throw new Error(err);
        }
      });
    });

    describe('PATCH /books/:id', () => {
      it('updates books by id', async () => {
        try {
          const book = books[0];
          const data = { title: 'Title' };
          const { status } = await appPatch(`/books/${book.id}`, data);
          const updatedBookRecord = await Book.findByPk(book.id, {
            raw: true,
          });

          expect(status).to.equal(200);
          expect(updatedBookRecord.title).to.equal(data.title);
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns a 404 if the book does not exist', async () => {
        try {
          const data = { title: 'Title' };
          const { status, body } = await appPatch('/books/12345', data);

          expect(status).to.equal(404);
          expect(body.error).to.equal('The book could not be found.');
        } catch (err) {
          throw new Error(err);
        }
      });
    });

    describe('DELETE /books/:id', () => {
      it('deletes book record by id', async () => {
        try {
          const book = books[0];
          const { status } = await appDelete(`/books/${book.id}`);
          const deletedBook = await Book.findByPk(book.id, { raw: true });

          expect(status).to.equal(204);
          expect(deletedBook).to.equal(null);
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns a 404 if the book does not exist', async () => {
        try {
          const { status, body } = await appDelete('/books/12345');

          expect(status).to.equal(404);
          expect(body.error).to.equal('The book could not be found.');
        } catch (err) {
          throw new Error(err);
        }
      });
    });
  });
});
