/* eslint-env mocha */

import chai from 'chai';
import ColorCast from '../lib/colorcast.js';
import config from './config.json';

chai.expect();

const expect = chai.expect;

let lib;

describe('Bad configurations', () => {
  describe('when I provide an empty configuration', () => {
    it('should throw an exception', () => {
      expect(() => new ColorCast({})).to.throw(Error);
    });
  });

  describe('when I provide mismatched names in a config', () => {
    it('should throw an exception', () => {
      expect(
        () =>
          new ColorCast({
            0: { one: {} },
            1: { two: {} },
          })
      ).to.throw(Error);
    });
  });

  describe('when I do not provide any components in a config', () => {
    it('should throw an exception', () => {
      expect(
        () =>
          new ColorCast({
            0: { one: {} },
            1: { one: {} },
          })
      ).to.throw(Error);
    });
  });

  describe('when I do not provide the right components in a config', () => {
    it('should throw an exception', () => {
      expect(
        () =>
          new ColorCast({
            0: { one: { saturation: 0, value: 0 } },
            1: { one: { saturation: 0 } },
          })
      ).to.throw(Error);
    });
  });
});

describe('Given the valid test config', () => {
  before(() => {
    lib = new ColorCast(config);
  });

  describe('When I ask for any hue', () => {
    it('should return an object with darker and highlight properties', () => {
      let result = lib.fromHue(0);
      expect(result).to.be.an('object');
      expect(result).to.have.property('highlight');
      expect(result).to.have.property('darker');
    });
  });

  describe('When I provide hue 5', () => {
    it('returns a darker value of #B62E22', () => {
      expect(lib.fromHue(5)).to.have.property('darker', '#B62E22');
    });
    it('returns a highlight value of #DC4234', () => {
      expect(lib.fromHue(5)).to.have.property('highlight', '#DC4234');
    });
  });

  describe('When I provide hue 0', () => {
    it('returns a darker value of #B32424', () => {
      expect(lib.fromHue(0)).to.have.property('darker', '#B32424');
    });
    it('returns a highlight value of #D93636', () => {
      expect(lib.fromHue(0)).to.have.property('highlight', '#D93636');
    });
  });

  describe('When I provide hue 360', () => {
    it('returns a darker value of #B32424', () => {
      expect(lib.fromHue(360)).to.have.property('darker', '#B32424');
    });
    it('returns a highlight value of #D93636', () => {
      expect(lib.fromHue(360)).to.have.property('highlight', '#D93636');
    });
  });

  describe('When I provide hue 365', () => {
    it('returns a darker value of #B62E22', () => {
      expect(lib.fromHue(365)).to.have.property('darker', '#B62E22');
    });
    it('returns a highlight value of #DC4234', () => {
      expect(lib.fromHue(365)).to.have.property('highlight', '#DC4234');
    });
  });

  describe('When I provide hue -355', () => {
    it('returns a darker value of #B62E22', () => {
      expect(lib.fromHue(-355)).to.have.property('darker', '#B62E22');
    });
    it('returns a highlight value of #DC4234', () => {
      expect(lib.fromHue(-355)).to.have.property('highlight', '#DC4234');
    });
  });

  describe('When I provide color #7A4B47', () => {
    it('returns a darker value of #B62E22', () => {
      expect(lib.fromHue(-355)).to.have.property('darker', '#B62E22');
    });
    it('returns a highlight value of #DC4234', () => {
      expect(lib.fromHue(-355)).to.have.property('highlight', '#DC4234');
    });
  });
});
