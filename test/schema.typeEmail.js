describe('Schema Type', function () {
  var Schema = seed.Schema;

  describe('Email', function () {
    var s = new Schema({
      email: Schema.Type.Email
    });

    it('should validate with a proper email', function () {
      s.validate({ _id: 'test', email: 'jake@alogicalparadox.com' }).should.be.ok;
    });

    it('should not validate with a bad email', function () {
      s.validate({ _id: 'test', email: '@jakeluer' }).should.not.be.ok;
      s.validate({ _id: 'test', email: 'hello world' }).should.not.be.ok;
    });
  });

});
