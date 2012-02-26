var chai = require('chai')
  , chaispies = require('chai-spies')
  , should = chai.should();

chai.use(chaispies);

var Seed = require('..')
  , Model = Seed.Model;

describe('Model', function () {
  describe('configuration', function () {

    it('should be an event emitter', function () {
      var spy = chai.spy(function (d) {
        d.should.eql({ hello: 'universe' });
      });

      Model.should.respondTo('on');
      Model.should.respondTo('emit');
      var model = new Model();
      model.should.have.property('_drip');
      model.on('test', spy);
      model.emit('test', { hello: 'universe' });
      spy.should.have.been.called.once;
    });

    it('should be constructed correctly', function () {
      var model = new Model({ hello: 'universe' });
      model.should.have.property('_attributes')
        .and.have.property('hello', 'universe');
      model._flags.should.be.instanceof(Seed.Hash);
      model.should.respondTo('flag');
      model.flag('new').should.be.true;
      model.flag('dirty').should.be.ture;
      model.should.respondTo('initialize');
    });

    it('should be `initialized`', function () {
      var spy = chai.spy()
        , M = Model.extend({
            initialize: spy
          });

      var model = new M();
      spy.should.have.been.called.once;
    });

    it('should understand types', function () {
      var model = new Model(null, { type: 'person' });
      model.type.should.be.person;
      var Person = Model.extend('person');
      Person.prototype._type.should.equal('person');
      var person = new Person();
      person.type.should.equal('person');
      person.type = 'alien';
      person.type.should.not.equal('alien');
      person.type.should.equal('person');
    });
  });

  describe('managing attributes', function () {
    var model = new Seed.Model();
    it('should allow for attributes to be `set`', function () {
      model.set('hello', 'universe');
      model._attributes.hello.should.equal('universe');
    });

    it('should allow for attributed to be `get`', function () {
      model.get('hello').should.equal('universe');
    });

    it('should allow for attributes to be `merged`', function () {
      model.merge({ hello: 'world' });
      model.get('hello').should.equal('world');
    });

    it('should allow for attributes to be `get` by path', function () {
      model.merge({ open: { source: 'always' }});
      model.get('open.source').should.equal('always');
    });
  });
});
