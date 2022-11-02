const { expect } = require('chai');
const { authorFactory } = require('../helpers/dataFactory');

describe('authorFactory', () => {
  it('generates random data', () => {
    const { author } = authorFactory();

    expect(typeof author).to.equal('string');
  });

  it('returns passed data', () => {
    const data = 'Author';

    const { author } = authorFactory(data);

    expect(author).to.equal(data);
  });

  it('works with empty string', () => {
    const data = '';

    const { author } = authorFactory(data);

    expect(author).to.equal(data);
  });

  it('works with null', () => {
    const data = null;

    const { author } = authorFactory(data);

    expect(author).to.equal(data);
  });
});
