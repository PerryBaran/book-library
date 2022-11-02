const { expect } = require('chai');
const { bookFactory } = require('../helpers/dataFactory');
const { ISBN_REGEX } = require('../../reusedVariables');

describe('bookFactory', () => {
  it('generates random data', () => {
    const { title, ISBN, AuthorId, GenreId } = bookFactory();

    expect(typeof title).to.equal('string');
    expect(typeof ISBN).to.equal('string');
    expect(ISBN.length).to.equal(13);
    expect(ISBN).to.match(ISBN_REGEX);
    expect(AuthorId).to.equal(undefined);
    expect(GenreId).to.equal(undefined);
  });

  it('returns passed data', () => {
    const data = {
      title: 'Title',
      ISBN: '1234567890123',
      authorId: 0,
      genreId: 0,
    };

    const { title, ISBN, AuthorId, GenreId } = bookFactory(data);

    expect(title).to.equal(data.title);
    expect(ISBN).to.equal(data.ISBN);
    expect(AuthorId).to.equal(data.authorId);
    expect(GenreId).to.equal(data.genreId);
  });

  it('works with empty strings', () => {
    const data = {
      title: '',
      author: '',
      ISBN: '',
      authorId: '',
      genreId: '',
    };

    const { title, ISBN, AuthorId, GenreId } = bookFactory(data);

    expect(title).to.equal(data.title);
    expect(ISBN).to.equal(data.ISBN);
    expect(AuthorId).to.equal(data.authorId);
    expect(GenreId).to.equal(data.genreId);
  });

  it('works with null', () => {
    const data = {
      title: null,
      author: null,
      ISBN: null,
      authorId: null,
      genreId: null,
    };

    const { title, ISBN, AuthorId, GenreId } = bookFactory(data);

    expect(title).to.equal(data.title);
    expect(ISBN).to.equal(data.ISBN);
    expect(AuthorId).to.equal(data.authorId);
    expect(GenreId).to.equal(data.genreId);
  });
});
