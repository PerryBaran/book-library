const sinon = require('sinon');
const bookController = require('../../src/controllers/book');
const helpers = require('../../src/controllers/helpers');

describe('book controller', () => {
  const req = {
    body: {},
    params: {
      bookId: 0,
    },
  };
  const res = {};

  afterEach(() => {
    sinon.restore();
  });

  describe('create', () => {
    it('is called correctly', async () => {
      try {
        const createMock = sinon.mock(helpers);

        createMock.expects('create').once().withArgs(req.body, res, 'book');

        await bookController.create(req, res);

        createMock.verify();
      } catch (err) {
        throw new Error(err);
      }
    });
  });

  describe('readAll', () => {
    it('is called correctly', async () => {
      try {
        const readAllMock = sinon.mock(helpers);

        readAllMock.expects('readAll').once().withArgs(res, 'book');

        await bookController.readAll('', res);

        readAllMock.verify();
      } catch (err) {
        throw new Error(err);
      }
    });
  });

  describe('readById', () => {
    it('is called correctly', async () => {
      try {
        const readByIdMock = sinon.mock(helpers);

        readByIdMock
          .expects('readById')
          .once()
          .withArgs(req.params.bookId, res, 'book');

        await bookController.readById(req, res);

        readByIdMock.verify();
      } catch (err) {
        throw new Error(err);
      }
    });
  });

  describe('update', () => {
    it('is called correctly', async () => {
      try {
        const updateMock = sinon.mock(helpers);

        updateMock
          .expects('update')
          .once()
          .withArgs(req.body, req.params.bookId, res, 'book');

        await bookController.update(req, res);

        updateMock.verify();
      } catch (err) {
        throw new Error(err);
      }
    });
  });

  describe('delete', () => {
    it('is called correctly', async () => {
      try {
        const deleteMock = sinon.mock(helpers);

        deleteMock
          .expects('delete')
          .once()
          .withArgs(req.params.bookId, res, 'book');

        await bookController.delete(req, res);

        deleteMock.verify();
      } catch (err) {
        throw new Error(err);
      }
    });
  });
});
