describe('Schema Type', function () {
  var Schema = seed.Schema;

  describe('Boolean', function () {
    var s = new Schema({
      bln: Boolean
    });

    it('should validate with a boolean', function () {
      s.validate({ bln: true }).should.be.true;
      s.validate({ bln: false }).should.be.true;
    });

    it('should not validate with non booleans', function () {
      s.validate({ bln: 0 }).should.be.false;
      s.validate({ bln: 1 }).should.be.false;
      s.validate({ bln: 12 }).should.be.false;
      s.validate({ bln: 'true' }).should.be.false;
      s.validate({ bln: { bln: true }}).should.be.false;
    });
  });

  describe('Number', function () {
    var s = new Schema({
      num: Number
    });

    it('should validate with a number', function () {
      s.validate({ num: 10 }).should.be.true;
    });

    it('should not validate with other types', function () {
      s.validate({ num: 'hello' }).should.be.false;
      s.validate({ num: [  ] }).should.be.false;
    });
  });

  describe('String', function () {
    var s = new Schema({
      str: String
    });

    it('should validate with a string', function () {
      s.validate({ str: 'hello' }).should.be.true;
    });

    it('should not validate with other types', function () {
      s.validate({ str: 1 }).should.be.false;
      s.validate({ str: [ 'hello' ] }).should.be.false;
    });
  });

  describe('Array', function () {
    var s = new Schema({
      arr: Array
    });

    it('should validate with a array', function () {
      s.validate({ arr: [ 'hello', 1 ] }).should.be.true;
    });

    it('should not validate with other types', function () {
      s.validate({ arr: 1 }).should.be.false;
      s.validate({ arr: 'hello' }).should.be.false;
    });
  });

  describe('Object', function () {
    var s = new Schema({
      obj: Object
    });

    it('should validate with an object', function () {
      s.validate({ obj: { testing: 1 } }).should.be.true;
    });

    it('should not validate with other types', function () {
      s.validate({ obj: [ 1, 2 ] }).should.be.false;
      s.validate({ obj: 'hello world' }).should.be.false;
    });

    it('should be able to get the value', function () {
      s.getValue({ obj: { testing: 1 }}).should.eql({ obj: { testing: 1 }});
    });
  });

});
