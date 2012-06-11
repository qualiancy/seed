var chai = require('chai')
  , should = chai.should();

var Seed = require('..')
  , Hash = Seed.Hash
  , Model = Seed.Model
  , Graph = Seed.Graph;

var Edge
  , Traversal;

if (process.env.SEED_COV) {
  Edge = require('../lib-cov/seed/graph/edge/model');
  Traversal = require('../lib-cov/seed/graph/traversal');
} else {
  Edge = require('../lib/seed/graph/edge/model');
  Traversal = require('../lib/seed/graph/traversal');
}

describe('Graph Traversal', function () {

  describe('Construction', function () {
    var g = new Graph({ type: 'test1' })
      , traverse = g.traverse();

    it('should constructor properly', function () {
      g.should.respondTo('traverse');

      traverse.should.be.instanceof(Traversal);
      traverse.should
        .respondTo('select')
        .respondTo('end')
        .respondTo('flag');

      traverse.flag('parent').should.eql(g);
      traverse.flag('live').should.be.false;
    });

    it('should have chainable commands', function () {
      traverse.should.have.property('out')
        .and.be.a('function');
      traverse.should.have.property('outE')
        .and.be.a('function');
      traverse.should.have.property('in')
        .and.be.a('function');
      traverse.should.have.property('inE')
        .and.be.a('function');
    });
  });

  describe('Static Traversal', function () {
    var Person = Model.extend('person')
      , g = new Graph({ type: 'static' })
      , doctor = new Person({ name: 'The Doctor' })
      , song = new Person({ name: 'River Song' })
      , pond = new Person({ name: 'Amy Pond' })
      , williams = new Person({ name: 'Rory Williams' });

    before(function () {
      g.define(Person);
      g.set(doctor);
    });

    it('can traverse when empty', function (done) {
      var traverse = g.traverse();
      traverse
        .select(doctor)
        .out
        .end(function (err, hash) {
          should.not.exist(err);
          hash.should.be.instanceof(Hash);
          hash.should.have.length(0);
          done();
        });
    });

    describe('with data', function () {

      before(function () {
        g.set(song);
        g.set(pond);
        g.set(williams);

        g.relate(doctor, song, 'married');
        g.relate(song, doctor, 'married');
        g.relate(pond, williams, 'married');
        g.relate(williams, pond, 'married');
        g.relate(pond, doctor, 'companion');
        g.relate(williams, pond, 'companion');
      });

      it('should have the proper edges', function () {
        g.should.have.length(4);
        g._edges.should.have.length(6);
      });

      it('should allow for `select`', function (done) {
        var traverse = g.traverse();
        traverse
          .select(doctor)
          .end(function (err, hash) {
            should.not.exist(err);
            hash.should.be.instanceof(Hash);
            hash.should.have.length(1);
            hash.at(0).should.eql(doctor);
            done();
          });
      });

      it('should allow for `out` VERTICES', function (done) {
        var traverse = g.traverse();
        traverse
          .select(pond)
          .out
          .end(function (err, hash) {
            should.not.exist(err);
            hash.should.be.instanceof(Hash);
            hash.should.have.length(2);
            hash.keys.should.include('/person/' + williams.id, '/person/' + doctor.id);
            done();
          });
      });

      it('should allow for `out` relation filtered VERTICES', function (done) {
        var traverse = g.traverse();
        traverse
          .select(pond)
          .out('married')
          .end(function (err, hash) {
            should.not.exist(err);
            hash.should.be.instanceof(Hash);
            hash.should.have.length(1);
            hash.at(0).should.eql(williams);
            done();
          });
      });

      it('should allow for `out` EDGES', function (done) {
        var traverse = g.traverse();
        traverse
          .select(pond)
          .outE
          .end(function (err, hash) {
            should.not.exist(err);
            hash.should.be.instanceof(Hash);
            hash.should.have.length(2);
            hash.each(function (e) {
              e.should.be.instanceof(Edge);
              e.get('x').should.eql(pond);
            });
            done();
          });
      });

      it('should allow for `out` relation filtered EDGES', function (done) {
        var traverse = g.traverse();
        traverse
          .select(pond)
          .outE('married')
          .end(function (err, hash) {
            should.not.exist(err);
            hash.should.be.instanceof(Hash);
            hash.should.have.length(1);
            hash.at(0).should.be.instanceof(Edge);
            hash.at(0).get('x').should.eql(pond);
            hash.at(0).get('y').should.eql(williams);
            hash.at(0).get('rel').should.eql('married');
            done();
          });
      });

      it('should allow for `in` VERTICES', function (done) {
        var traverse = g.traverse();
        traverse
          .select(doctor)
          .in
          .end(function (err, hash) {
            should.not.exist(err);
            hash.should.be.instanceof(Hash);
            hash.should.have.length(2);
            hash.keys.should.include('/person/' + song.id, '/person/' + pond.id);
            done();
          });
      });

      it('should allow for `in` relation filtered VERTICES', function (done) {
        var traverse = g.traverse();
        traverse
          .select(doctor)
          .in('married')
          .end(function (err, hash) {
            should.not.exist(err);
            hash.should.be.instanceof(Hash);
            hash.should.have.length(1);
            hash.at(0).should.eql(song);
            done();
          });
      });

      it('should allow for `in` EDGES', function (done) {
        var traverse = g.traverse();
        traverse
          .select(doctor)
          .inE
          .end(function (err, hash) {
            should.not.exist(err);
            hash.should.be.instanceof(Hash);
            hash.should.have.length(2);
            hash.each(function (e) {
              e.should.be.instanceof(Edge);
              e.get('y').should.eql(doctor);
            });
            done();
          });
      });

      it('should allow for `in` relation filtered EDGES', function (done) {
        var traverse = g.traverse();
        traverse
          .select(doctor)
          .inE('companion')
          .end(function (err, hash) {
            should.not.exist(err);
            hash.should.be.instanceof(Hash);
            hash.should.have.length(1);
            hash.at(0).should.be.instanceof(Edge);
            hash.at(0).get('x').should.eql(pond);
            hash.at(0).get('y').should.eql(doctor);
            hash.at(0).get('rel').should.eql('companion');
            done();
          });
      });

    });
  });

  describe('Live Traversal', function () {
    var Person = Model.extend('person')
      , store = new Seed.MemoryStore()
      , g = new Graph({ type: 'static', store: store })
      , doctor = new Person({ name: 'The Doctor' })
      , song = new Person({ name: 'River Song' })
      , pond = new Person({ name: 'Amy Pond' })
      , williams = new Person({ name: 'Rory Williams' });

    before(function (done) {
      g.define(Person);

      g.set(doctor);
      doctor.save(function (err) {
        if (err) throw err;
        done();
      });
    });

    it('can traverse on an empty db', function (done) {
      g.flush();
      var traverse = g.traverse({ live: true });
      traverse
        .select(doctor)
        .out
        .end(function (err, hash) {
          should.not.exist(err);
          hash.should.be.instanceof(Hash);
          hash.should.have.length(0);
          done();
        });
    });

    describe('with records', function () {

      before(function (done) {
        g.set(song);
        g.set(pond);
        g.set(williams);

        g.relate(doctor, song, 'married');
        g.relate(song, doctor, 'married');
        g.relate(pond, williams, 'married');
        g.relate(williams, pond, 'married');
        g.relate(pond, doctor, 'companion');
        g.relate(williams, pond, 'companion');

        g.push(function (err) {
          if (err) throw err;
          done();
        });
      });

      beforeEach(function () {
        g.flush();
      });

      it('should allow for a `out` EDGES', function (done) {
        g.should.have.length(0);
        g._edges.should.have.length(0);

        g.set(pond);

        var traverse = g.traverse({ live: true });
        traverse
          .select(pond)
          .outE
          .end(function (err, hash) {
            should.not.exist(err);
            hash.should.be.instanceof(Hash);
            hash.should.have.length(2);
            hash.each(function (e) {
              e.should.be.instanceof(Edge);
              e.get('x').should.eql(pond);
            });
            done();
          });
      });

      it('should allow for a `out` relation filtered EDGES', function (done) {
        g.should.have.length(0);
        g._edges.should.have.length(0);

        g.set(pond);

        var traverse = g.traverse({ live: true });
        traverse
          .select(pond)
          .outE('married')
          .end(function (err, hash) {
            should.not.exist(err);
            hash.should.be.instanceof(Hash);
            hash.should.have.length(1);

            var edge = hash.at(0);
            edge.should.be.instanceof(Edge);
            edge.get('x').should.eql(pond);
            edge.get('y.$id').should.equal(williams.id);
            done();
          });
      });

      it('should allow for `in` EDGES', function (done) {
        g.should.have.length(0);
        g._edges.should.have.length(0);

        g.set(pond);

        var traverse = g.traverse({ live: true });
        traverse
          .select(pond)
          .inE
          .end(function (err, hash) {
            should.not.exist(err);
            hash.should.be.instanceof(Hash);
            hash.should.have.length(2);
            hash.each(function (e) {
              e.should.be.instanceof(Edge);
              e.get('y').should.eql(pond);
            });
            done();
          });
      });

      it('should allow for a `in` relation filtered EDGES', function (done) {
        g.should.have.length(0);
        g._edges.should.have.length(0);

        g.set(pond);

        var traverse = g.traverse({ live: true });
        traverse
          .select(pond)
          .inE('married')
          .end(function (err, hash) {
            should.not.exist(err);
            hash.should.be.instanceof(Hash);
            hash.should.have.length(1);

            var edge = hash.at(0);
            edge.should.be.instanceof(Edge);
            edge.get('y').should.eql(pond);
            edge.get('x.$id').should.equal(williams.id);
            done();
          });
      });

      it('should allow for `out` VERTICES', function (done) {
        g.should.have.length(0);
        g._edges.should.have.length(0);

        g.set(pond);

        var traverse = g.traverse({ live: true });
        traverse
          .select(pond)
          .out
          .end(function (err, hash) {
            should.not.exist(err);
            hash.should.be.instanceof(Hash);
            hash.should.have.length(2);
            hash.keys.should.include('/person/' + williams.id, '/person/' + doctor.id);
            done();
          });
      });

      it('should allow for `out` filtered VERTICES', function (done) {
        g.should.have.length(0);
        g._edges.should.have.length(0);

        g.set(pond);

        var traverse = g.traverse({ live: true });
        traverse
          .select(pond)
          .out('married')
          .end(function (err, hash) {
            should.not.exist(err);
            hash.should.be.instanceof(Hash);
            hash.should.have.length(1);
            hash.at(0).id.should.equal(williams.id);
            hash.at(0).get('name').should.equal(williams.get('name'));
            done();
          });
      });

      it('should allow for `in` VERTICES', function (done) {
        g.should.have.length(0);
        g._edges.should.have.length(0);

        g.set(doctor);

        var traverse = g.traverse({ live: true });
        traverse
          .select(doctor)
          .in
          .end(function (err, hash) {
            should.not.exist(err);
            hash.should.be.instanceof(Hash);
            hash.should.have.length(2);
            hash.keys.should.include('/person/' + pond.id, '/person/' + song.id);
            done();
          });
      });

      it('should allow for `in` filtered VERTICES', function (done) {
        g.should.have.length(0);
        g._edges.should.have.length(0);

        g.set(doctor);

        var traverse = g.traverse({ live: true });
        traverse
          .select(doctor)
          .in('married')
          .end(function (err, hash) {
            should.not.exist(err);
            hash.should.be.instanceof(Hash);
            hash.should.have.length(1);
            hash.at(0).id.should.equal(song.id);
            hash.at(0).get('name').should.equal(song.get('name'));
            done();
          });
      });
    });
  });
});
