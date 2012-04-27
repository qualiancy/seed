var chai = require('chai')
  , should = chai.should();

var Seed = require('..')
  , Model = Seed.Model
  , Graph = Seed.Graph;

var Edge = require('../lib/seed/graph/edge/model');

describe('Graph Theory', function () {

  it('should provide the graph theory methods', function () {
    Graph.should.respondTo('relate');
    Graph.should.respondTo('unrelate');
    Graph.should.respondTo('traverse');
  });

  describe('Edge', function () {
    var Person = Model.extend('person')
      , people = new Graph({ type: 'people' });

    var smith = new Person({ name: 'John Smith' })
      , pond = new Person({ name: 'Amy Pond' });

    before(function () {
      people.define(Person);
      people.set(smith);
      people.set(pond);
    });

    it('should able to be created', function () {
      people.should.have.length(2);
      people._edges.should.have.length(0);

      people.relate(pond, smith, 'companion');
      people.should.have.length(2);
      people._edges.should.have.length(1);
    });

    it('should be a valid edge model', function () {
      var edge = people._edges.at(0);
      edge.should.be.instanceof(Edge);
      edge.parent.should.eql(people);
      edge.validate().should.be.true;
      edge.type.should.equal('people_edge');
      edge.get('x').should.eql(pond);
      edge.get('y').should.eql(smith);
      edge.get('rel').should.equal('companion');
    });

    it('should be able to be removed', function () {
      people.should.have.length(2);
      people._edges.should.have.length(1);

      people.unrelate(pond, smith, 'companion');
      people.should.have.length(2);
      people._edges.should.have.length(0);
    });
  });
});
