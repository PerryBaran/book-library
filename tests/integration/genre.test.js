const { expect } = require('chai');
const { Genre } = require('../../src/models');
const { genreFactory } = require('../helpers/dataFactory');
const {
  appPost,
  appGet,
  appPatch,
  appDelete,
} = require('../helpers/requestHelpers');

describe('/genres', () => {
  before(async () => {
    try {
      await Genre.sequelize.sync();
    } catch (err) {
      throw new Error(err);
    }
  });

  afterEach(async () => {
    try {
      await Genre.destroy({ where: {} });
    } catch (err) {
      throw new Error(err);
    }
  });

  describe('with no records in the database', () => {
    describe('POST /genres', () => {
      it('creates a new genre in the database', async () => {
        try {
          const data = genreFactory();
          const { status, body } = await appPost('/genres', data);
          const newGenreRecord = await Genre.findByPk(body.id, {
            raw: true,
          });

          expect(status).to.equal(201);
          expect(body.genre).to.equal(data.genre);
          expect(newGenreRecord.genre).to.equal(data.genre);
        } catch (err) {
          throw new Error(err);
        }
      });

      describe('genre', () => {
        it('must contain a genre', async () => {
          try {
            const data = genreFactory(null);
            const { status, body } = await appPost('/genres', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('Must provide a genre');
          } catch (err) {
            throw new Error(err);
          }
        });

        it('genre cannot be empty', async () => {
          try {
            const data = genreFactory('');
            const { status, body } = await appPost('/genres', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('The genre cannot be empty');
          } catch (err) {
            throw new Error(err);
          }
        });

        it('genre must be unique', async () => {
          try {
            const data = genreFactory('Genre');
            await appPost('/genres', data);
            const { status, body } = await appPost('/genres', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('The genre must be unique');
          } catch (err) {
            throw new Error(err);
          }
        });
      });
    });
  });

  describe('with records in the database', () => {
    let genres;

    beforeEach(async () => {
      try {
        genres = await Promise.all([
          Genre.create(genreFactory()),
          Genre.create(genreFactory()),
          Genre.create(genreFactory()),
        ]);
      } catch (err) {
        throw new Error(err);
      }
    });

    describe('GET /genres', () => {
      it('gets all genre records', async () => {
        try {
          const { status, body } = await appGet('/genres');

          expect(status).to.equal(200);
          expect(body.length).to.equal(genres.length);

          body.forEach((genre) => {
            const expected = genres.find((item) => item.id === genre.id);

            expect(genre.genre).to.equal(expected.genre);
          });
        } catch (err) {
          throw new Error(err);
        }
      });
    });

    describe('GET /genres/:id', () => {
      it('gets genre record by id', async () => {
        try {
          const genre = genres[0];
          const { status, body } = await appGet(`/genres/${genre.id}`);

          expect(status).to.equal(200);
          expect(body.genre).to.equal(genre.genre);
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns a 404 if the genre does not exist', async () => {
        try {
          const { status, body } = await appGet('/genres/12345');

          expect(status).to.equal(404);
          expect(body.error).to.equal('The genre could not be found.');
        } catch (err) {
          throw new Error(err);
        }
      });
    });

    describe('PATCH /genres/:id', () => {
      it('updates genre by id', async () => {
        try {
          const genre = genres[0];
          const data = { genre: 'Genre' };
          const { status } = await appPatch(`/genres/${genre.id}`, data);
          const updatedGenreRecord = await Genre.findByPk(genre.id, {
            raw: true,
          });

          expect(status).to.equal(200);
          expect(updatedGenreRecord.genre).to.equal(data.genre);
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns a 404 if the genre does not exist', async () => {
        try {
          const data = { genre: 'Genre' };
          const { status, body } = await appPatch('/genres/12345', data);

          expect(status).to.equal(404);
          expect(body.error).to.equal('The genre could not be found.');
        } catch (err) {
          throw new Error(err);
        }
      });
    });

    describe('DELETE /genres/:id', () => {
      it('deletes genre record by id', async () => {
        try {
          const genre = genres[0];
          const { status } = await appDelete(`/genres/${genre.id}`);
          const deletedGenre = await Genre.findByPk(genre.id, { raw: true });

          expect(status).to.equal(204);
          expect(deletedGenre).to.equal(null);
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns a 404 if the genre does not exist', async () => {
        try {
          const { status, body } = await appDelete('/genres/12345');

          expect(status).to.equal(404);
          expect(body.error).to.equal('The genre could not be found.');
        } catch (err) {
          throw new Error(err);
        }
      });
    });
  });
});
