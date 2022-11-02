const sinon = require('sinon');
const readerController = require('../../src/controllers/reader');
const helpers = require('../../src/controllers/helpers');

describe('reader controller', () => {
  const req = {
    body: {},
    params: {
      readerId: 0,
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

        createMock.expects('create').once().withArgs(req.body, res, 'reader');

        await readerController.create(req, res);

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

        readAllMock.expects('readAll').once().withArgs(res, 'reader');

        await readerController.readAll('', res);

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
          .withArgs(req.params.readerId, res, 'reader');

        await readerController.readById(req, res);

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
          .withArgs(req.body, req.params.readerId, res, 'reader');

        await readerController.update(req, res);

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
          .withArgs(req.params.readerId, res, 'reader');

        await readerController.delete(req, res);

        deleteMock.verify();
      } catch (err) {
        throw new Error(err);
      }
    });
  });
});
