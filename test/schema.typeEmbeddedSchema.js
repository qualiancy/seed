describe('Schema Type', function () {
  var Schema = seed.Schema;

  describe('EmbeddedSchema', function () {
    var s_inner = new Schema({
      name: {
          type: String
        , required: true
      }
    });

    var s = new Schema({
        id: Number
      , names: [ s_inner ]
      , tags: [ { tag: String } ]
    });

    it('should have the proper definition', function () {
      s.paths.should.have.length(3);
      s.paths.keys.should.include('id', 'names', 'tags');

      s.paths.get('names')
        .should.have.property('type')
          .to.eql(Schema.Type.EmbeddedSchema);

      s.paths.get('names')
        .should.have.property('schema')
          .to.be.instanceof(Schema)
          .and.eql(s_inner);

      s.paths.get('tags')
        .should.have.property('type')
          .to.eql(Schema.Type.EmbeddedSchema);

      s.paths.get('tags')
        .should.have.property('schema')
          .to.be.instanceof(Schema)
          .and.have.property('_definition')
            .to.eql({ tag: String });
    });

    it('should validate with the proper values', function () {
      s.validate({
          id: 1
        , names:
            [ { name: 'hello' }
            , { name: 'universe' } ]
        , tags:
            [ { tag: 'worldy' }
            , { tag: 'validation' } ]
      }).should.be.true;
    });

    it('should not validate with non-object values', function () {
      s.validate({
          id: 2
        , names: [ 'hello', 'universe' ]
        , tags: [ 'worldly', 'validation' ]
      }).should.be.false;
    });

    it('should not validate with nested bad types', function () {
      s.validate({
          id: 3
        , names: [ { name: 1 } ]
      }).should.be.false;
    });

    it('should not validate with nested missing required fields', function () {
      s.validate({
          id: 4
        , names: [ { non_name: 'string' } ]
      }).should.be.false;
    });
  });
});
