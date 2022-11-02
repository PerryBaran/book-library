const { expect } = require('chai');
const { Author } = require('../../src/models');
const { authorFactory } = require('../helpers/dataFactory');
const {
  appPost,
  appGet,
  appPatch,
  appDelete,
} = require('../helpers/requestHelpers');

describe('/authors', () => {
  before(async () => {
    try {
      await Author.sequelize.sync();
    } catch (err) {
      throw new Error(err);
    }
  });

  afterEach(async () => {
    try {
      await Author.destroy({ where: {} });
    } catch (err) {
      throw new Error(err);
    }
  });

  describe('with no records in the database', () => {
    describe('POST /authors', () => {
      it('creates a new author in the database', async () => {
        try {
          const data = authorFactory();
          const { status, body } = await appPost('/authors', data);
          const newAuthorRecord = await Author.findByPk(body.id, {
            raw: true,
          });

          expect(status).to.equal(201);
          expect(body.author).to.equal(data.author);
          expect(newAuthorRecord.author).to.equal(data.author);
        } catch (err) {
          throw new Error(err);
        }
      });

      describe('author', () => {
        it('must contain an author', async () => {
          try {
            const data = undefined;
            const { status, body } = await appPost('/authors', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('Must provide an author');
          } catch (err) {
            throw new Error(err);
          }
        });

        it('author cannot be empty', async () => {
          try {
            const data = authorFactory('');
            const { status, body } = await appPost('/authors', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('The author cannot be empty');
          } catch (err) {
            throw new Error(err);
          }
        });

        it('author must be unique', async () => {
          try {
            const data = authorFactory('Arther');
            await appPost('/authors', data);
            const { status, body } = await appPost('/authors', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('The author must be unique');
          } catch (err) {
            throw new Error(err);
          }
        });
      });
    });
  });

  describe('with records in the database', () => {
    let authors;

    beforeEach(async () => {
      try {
        authors = await Promise.all([
          Author.create(authorFactory()),
          Author.create(authorFactory()),
          Author.create(authorFactory()),
        ]);
      } catch (err) {
        throw new Error(err);
      }
    });

    describe('GET /authors', () => {
      it('gets all author records', async () => {
        try {
          const { status, body } = await appGet('/authors');

          expect(status).to.equal(200);
          expect(body.length).to.equal(3);

          body.forEach((author) => {
            const expectedAuthor = authors.find(
              (item) => item.id === author.id
            );

            expect(author.author).to.equal(expectedAuthor.author);
          });
        } catch (err) {
          throw new Error(err);
        }
      });
    });

    describe('GET /authors/:id', () => {
      it('gets author record by id', async () => {
        try {
          const author = authors[0];
          const { status, body } = await appGet(`/authors/${author.id}`);

          expect(status).to.equal(200);
          expect(body.author).to.equal(author.author);
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns a 404 if the author does not exist', async () => {
        try {
          const { status, body } = await appGet('/authors/12345');

          expect(status).to.equal(404);
          expect(body.error).to.equal('The author could not be found.');
        } catch (err) {
          throw new Error(err);
        }
      });
    });

    describe('PATCH /authors/:id', () => {
      it('updates author by id', async () => {
        try {
          const author = authors[0];
          const data = { author: 'Arthur' };
          const { status } = await appPatch(`/authors/${author.id}`, data);
          const updatedAuthorRecord = await Author.findByPk(author.id, {
            raw: true,
          });

          expect(status).to.equal(200);
          expect(updatedAuthorRecord.author).to.equal(data.author);
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns a 404 if the author does not exist', async () => {
        try {
          const data = { author: 'Arthur' };
          const { status, body } = await appPatch('/authors/12345', data);

          expect(status).to.equal(404);
          expect(body.error).to.equal('The author could not be found.');
        } catch (err) {
          throw new Error(err);
        }
      });
    });

    describe('DELETE /authors/:id', () => {
      it('deletes author record by id', async () => {
        try {
          const author = authors[0];
          const { status } = await appDelete(`/authors/${author.id}`);
          const deletedAuthor = await Author.findByPk(author.id, { raw: true });

          expect(status).to.equal(204);
          expect(deletedAuthor).to.equal(null);
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns a 404 if the author does not exist', async () => {
        try {
          const { status, body } = await appDelete('/authors/12345');

          expect(status).to.equal(404);
          expect(body.error).to.equal('The author could not be found.');
        } catch (err) {
          throw new Error(err);
        }
      });
    });
  });
});
