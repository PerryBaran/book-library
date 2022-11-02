const { expect } = require('chai');
const { Reader } = require('../../src/models');
const { readerFactory } = require('../helpers/dataFactory');
const {
  appPost,
  appGet,
  appPatch,
  appDelete,
} = require('../helpers/requestHelpers');

describe('/readers', () => {
  before(async () => {
    try {
      await Reader.sequelize.sync();
    } catch (err) {
      throw new Error(err);
    }
  });

  afterEach(async () => {
    try {
      await Reader.destroy({ where: {} });
    } catch (err) {
      throw new Error(err);
    }
  });

  describe('with no records in the database', () => {
    describe('POST /readers', () => {
      it('creates a new reader in the database', async () => {
        try {
          const data = readerFactory();
          const { status, body } = await appPost('/readers', data);
          const newReaderRecord = await Reader.unscoped().findByPk(body.id, {
            raw: true,
          });

          expect(status).to.equal(201);
          expect(body.name).to.equal(data.name);
          expect(body.email).to.equal(data.email);
          expect(body.password).to.equal(undefined);
          expect(newReaderRecord.name).to.equal(data.name);
          expect(newReaderRecord.email).to.equal(data.email);
          expect(newReaderRecord.password).to.equal(data.password);
        } catch (err) {
          throw new Error(err);
        }
      });

      describe('name', () => {
        it('must contain a name', async () => {
          try {
            const data = readerFactory({ name: null });
            const { status, body } = await appPost('/readers', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('Must provide a name');
          } catch (err) {
            throw new Error(err);
          }
        });

        it('name must not be empty', async () => {
          try {
            const data = readerFactory({ name: '' });
            const { status, body } = await appPost('/readers', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('The name cannot be empty');
          } catch (err) {
            throw new Error(err);
          }
        });
      });

      describe('email', () => {
        it('must contain an email', async () => {
          try {
            const data = readerFactory({ email: null });
            const { status, body } = await appPost('/readers', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('Must provide an email');
          } catch (err) {
            throw new Error(err);
          }
        });

        it('email must be valid format', async () => {
          try {
            const data = readerFactory({ email: 'fake' });
            const { status, body } = await appPost('/readers', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('Email must be valid');
          } catch (err) {
            throw new Error(err);
          }
        });

        it('email must be unique', async () => {
          try {
            const data = readerFactory({ email: 'valid@email.com' });
            await appPost('/readers', data);
            const { status, body } = await appPost('/readers', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('This email is already in use');
          } catch (err) {
            throw new Error(err);
          }
        });
      });

      describe('password', () => {
        it('must contain a password', async () => {
          try {
            const data = readerFactory({ password: null });
            const { status, body } = await appPost('/readers', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal('Must provide a password');
          } catch (err) {
            throw new Error(err);
          }
        });

        it('password must atleast 8 characters long', async () => {
          try {
            const data = readerFactory({ password: '1234567' });
            const { status, body } = await appPost('/readers', data);

            expect(status).to.equal(500);
            expect(body.error[0]).to.equal(
              'Password must be atleast 8 characters'
            );
          } catch (err) {
            throw new Error(err);
          }
        });
      });
    });
  });

  describe('with records in the database', () => {
    let readers;

    beforeEach(async () => {
      try {
        readers = await Promise.all([
          Reader.create(readerFactory()),
          Reader.create(readerFactory()),
          Reader.create(readerFactory()),
        ]);
      } catch (err) {
        throw new Error(err);
      }
    });

    describe('GET /readers', () => {
      it('gets all readers records', async () => {
        try {
          const { status, body } = await appGet('/readers');

          expect(status).to.equal(200);
          expect(body.length).to.equal(readers.length);

          body.forEach((reader) => {
            const expectedReader = readers.find(
              (item) => item.id === reader.id
            );

            expect(reader.name).to.equal(expectedReader.name);
            expect(reader.email).to.equal(expectedReader.email);
            expect(reader.password).to.equal(undefined);
          });
        } catch (err) {
          throw new Error(err);
        }
      });
    });

    describe('GET /readers/:id', () => {
      it('gets readers record by id', async () => {
        try {
          const reader = readers[0];
          const { status, body } = await appGet(`/readers/${reader.id}`);

          expect(status).to.equal(200);
          expect(body.name).to.equal(reader.name);
          expect(body.email).to.equal(reader.email);
          expect(body.password).to.equal(undefined);
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns a 404 if the reader does not exist', async () => {
        try {
          const { status, body } = await appGet('/readers/12345');

          expect(status).to.equal(404);
          expect(body.error).to.equal('The reader could not be found.');
        } catch (err) {
          throw new Error(err);
        }
      });
    });

    describe('PATCH /readers/:id', () => {
      it('updates readers email by id', async () => {
        try {
          const reader = readers[0];
          const data = { email: 'miss_e_bennet@gmail.com' };
          const { status } = await appPatch(`/readers/${reader.id}`, data);
          const updatedReaderRecord = await Reader.findByPk(reader.id, {
            raw: true,
          });

          expect(status).to.equal(200);
          expect(updatedReaderRecord.email).to.equal(data.email);
          expect(updatedReaderRecord.password).to.equal(undefined);
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns a 404 if the reader does not exist', async () => {
        try {
          const data = { email: 'some_new_email@gmail.com' };
          const { status, body } = await appPatch('/readers/12345', data);

          expect(status).to.equal(404);
          expect(body.error).to.equal('The reader could not be found.');
        } catch (err) {
          throw new Error(err);
        }
      });
    });

    describe('DELETE /readers/:id', () => {
      it('deletes reader record by id', async () => {
        try {
          const reader = readers[0];
          const { status } = await appDelete(`/readers/${reader.id}`);
          const deletedReader = await Reader.findByPk(reader.id, { raw: true });

          expect(status).to.equal(204);
          expect(deletedReader).to.equal(null);
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns a 404 if the reader does not exist', async () => {
        try {
          const { status, body } = await appDelete('/readers/12345');

          expect(status).to.equal(404);
          expect(body.error).to.equal('The reader could not be found.');
        } catch (err) {
          throw new Error(err);
        }
      });
    });
  });
});
