const { expect } = require('chai');
const { readerFactory } = require('../helpers/dataFactory');

describe('readerFactory', () => {
  it('generates random data', () => {
    const { name, email, password } = readerFactory();

    expect(typeof name).to.equal('string');
    expect(typeof email).to.equal('string');
    expect(email).to.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);
    expect(typeof password).to.equal('string');
    expect(password.length).to.equal(8);
  });

  it('returns passed data', () => {
    const data = {
      name: 'Name',
      email: 'email@email.com',
      password: 'password',
    };

    const { name, email, password } = readerFactory(data);

    expect(name).to.equal(data.name);
    expect(email).to.equal(data.email);
    expect(password).to.equal(data.password);
  });

  it('works with empty strings', () => {
    const data = {
      name: '',
      email: '',
      password: '',
    };

    const { name, email, password } = readerFactory(data);

    expect(name).to.equal(data.name);
    expect(email).to.equal(data.email);
    expect(password).to.equal(data.password);
  });

  it('works with null', () => {
    const data = {
      name: null,
      email: null,
      password: null,
    };

    const { name, email, password } = readerFactory(data);

    expect(name).to.equal(data.name);
    expect(email).to.equal(data.email);
    expect(password).to.equal(data.password);
  });
});
