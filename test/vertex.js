var _ = require('lodash');
var expect = require("chai").expect;
var Vertex = require("../lib/graph/vertex.js");
var Edge = require("../lib/graph/edge.js");

describe("Vertex", function() {

	var vertices;
	/**
	 * Produces the following DAG:
	 * 	0 ──────┬───────┐
	 *    *     │       │
	 *      1   |       │
	 *      │ * V       │
	 *      │   2       │
	 *      │     *     │
	 *      └──────>3   |
	 *                * V
	 *                  4 ──┐
	 *                    * V
	 *                      5
	 */
	var mockupChain = function() {
		vertices = [];
		for (let i = 0; i < 6; i++) {
			vertices.push(new Vertex(i));
			if(i >= 1) {
				vertices[i-1]._next = vertices[i];
				vertices[i]._previous = vertices[i-1];
			}
		}
		let e1 = new Edge(vertices[0], vertices[2]);
		let e2 = new Edge(vertices[0], vertices[4]);
		let e3 = new Edge(vertices[1], vertices[3]);
		let e4 = new Edge(vertices[4], vertices[5]);
		vertices[0]._uplinks = [];
		vertices[0]._downlinks = [ e1, e2 ];
		vertices[1]._uplinks = [];
		vertices[1]._downlinks = [ e3 ];
		vertices[2]._uplinks = [ e1 ];
		vertices[2]._downlinks = [];
		vertices[3]._uplinks = [ e3 ];
		vertices[3]._downlinks = [];
		vertices[4]._uplinks = [ e2 ];
		vertices[4]._downlinks = [ e4 ];
		vertices[5]._uplinks = [ e4 ];
	};
	var teardownChain = function() {
		vertices = null;
	};

	describe("constructor()", function() {
		describe("when no arguments are supplied", function() {
			it("should throw an error.", function() {
				var fn = function() { return new Vertex(); };
				expect(fn).to.throw(Error);
			});
		});
		describe("when the first argument is supplied", function() {
			it("should throw an error when the first argument is not a Number.", function() {
				var fn = function() { return new Vertex("abc"); };
				expect(fn).to.throw(Error);
			});
			it("should return a new instance of Vertex.", function() {
				expect(new Vertex(0)).to.be.an.instanceOf(Vertex);
			});
			it("should assign the given Number to the _id property.", function() {
				expect(new Vertex(0)).to.have.property("_id", 0);
			});
			it("should initialise _uplinks as an empty array.", function() {
				expect(new Vertex(0)).to.have.property("_uplinks").with.length(0);
			});
			it("should initialise _downlinks as an empty array.", function() {
				expect(new Vertex(0)).to.have.property("_downlinks").with.length(0);
			});
		});
	});

	describe("#previous", function() {
		describe("when the previous Vertex is not set", function() {
			it("should return undefined.", function() {
				var v = new Vertex(0);
				expect(v).to.have.property("previous", undefined);
			});
		});
		describe("when the previous Vertex is set", function() {
			it("should return an instance of Vertex.", function() {
				var v0 = new Vertex(0);
				var v1 = new Vertex(1);
				v1._previous = v0;
				expect(v1).to.have.property("previous", v0);
			});
		});
	});

	describe("#next", function() {
		describe("when the next Vertex is not set", function() {
			it("should return undefined.", function() {
				var v = new Vertex(0);
				expect(v).to.have.property("next", undefined);
			});
		});
		describe("when the next Vertex is set", function() {
			it("should return an instance of Vertex.", function() {
				var v0 = new Vertex(0);
				var v1 = new Vertex(1);
				v0._next = v1;
				expect(v0).to.have.property("next", v1);
			});
		});
	});

	describe("#insertBefore()", function() {
		beforeEach(mockupChain);
		afterEach(teardownChain);
		describe("when no arguments are supplied", function() {
			it("should throw an error if the first argument is not a Vertex.", function() {
				let v = new Vertex(0);
				let fn = function() { return v.insertBefore("abc"); };
				expect(fn).to.throw(Error);
			});
		});
		describe("when the first argument is supplied.", function() {
			var v6;			
			beforeEach(function() {
				v6 = new Vertex(6);
				// v0 > v1 > v2 > v3 > v6 > v4 > v5
				vertices[4].insertBefore(v6);
			});
			afterEach(function() {
				v6 = null;
			});
			it("should set the 'next' property of the given vertex's 'last' to be this vertex.", function() {			
				expect(v6.next).to.equal(vertices[4]);
			});
			it("should set the given Vertex's 'previous' property to be this Vertex's 'previous'", function() {
				expect(v6.previous).to.equal(vertices[3]);
			});
			it("should set this vertex's 'previous' property to be the given Vertex.", function() {
				expect(vertices[4].previous).to.equal(v6);
			});
			describe("when this vertex's 'previous' property is already set", function() {
				it("should set the 'next' property of this Vertex's 'previous' to be the given vertex's 'first'.", function() {
					expect(vertices[3].next).to.equal(v6);
				});
			});
		});
	});

	describe("#insertAfter()", function() {
		beforeEach(mockupChain);
		afterEach(teardownChain);
		describe("when no arguments are supplied", function() {
			it("should throw an error if the first argument is not a Vertex.", function() {
				let v = new Vertex(0);
				let fn = function() { return v.insertAfter("abc"); };
				expect(fn).to.throw(Error);
			});
		});
		describe("when the first argument is supplied.", function() {
			var v6;			
			beforeEach(function() {
				v6 = new Vertex(6);
				// v0 > v1 > v2 > v3 > v6 > v4 > v5
				vertices[3].insertAfter(v6);
			});
			afterEach(function() {
				v6 = null;
			});
			it("should set the given Vertex's 'previous' property to be this Vertex.", function() {				
				expect(v6.previous).to.equal(vertices[3]);
			});
			it("should set the given Vertex's 'next' property to be this Vertex's 'next'", function() {
				expect(v6.next).to.equal(vertices[4]);
			});
			it("should set this Vertex's 'next' property to be the given Vertex.", function() {
				expect(vertices[3].next).to.equal(v6);
			});
			describe("when this Vertex's 'next' property is already set", function() {
				it("should set the 'previous' property of this Vertex's 'next' to be the given Vertex.", function() {
					expect(vertices[4].previous).to.equal(v6);
				});
			});
		});
	});

	describe("#isBefore()", function() {
		beforeEach(mockupChain);
		afterEach(teardownChain);
		it("should throw an error when the first argument is not a Vertex.", function() {
			let fn = function() { return vertices[0].isBefore("abc"); };
			expect(fn).to.throw(Error);
		});
		it("should return true when this vertex is before the given vertex.", function() {
			expect(vertices[1].isBefore(vertices[2])).to.be.true;	// jshint ignore:line
		});
		it("should return false when this vertex is not before the given vertex.", function() {
			expect(vertices[2].isBefore(vertices[1])).to.be.false;	// jshint ignore:line
		});
	});

	describe("#isAfter()", function() {
		beforeEach(mockupChain);
		afterEach(teardownChain);
		it("should throw an error when the first argument is not a Vertex.", function() {
			let fn = function() { return vertices[0].isAfter("abc"); };
			expect(fn).to.throw(Error);
		});
		it("should return true when this vertex is after the given vertex.", function() {
			expect(vertices[2].isAfter(vertices[1])).to.be.true;	// jshint ignore:line
		});
		it("should return false when this vertex is not after the given vertex.", function() {
			expect(vertices[1].isAfter(vertices[2])).to.be.false;	// jshint ignore:line
		});
	});

	describe("#remove()", function() {
		beforeEach(mockupChain);
		afterEach(teardownChain);
		it("should return this Vertex.", function() {
			expect(vertices[0].remove()).to.equal(vertices[0]);
		});
		describe("when this Vertex's 'previous' property is set", function() {			
			it("should set the 'next' property of this Vertex's 'previous' property to be the Vertex given by this Vertex's 'next' property.", function() {
				let v = vertices;
				var prev = v[1]._previous;	// v[0]
				var next = v[1]._next;			// v[2]
				v[1].remove();
				expect(prev._next).to.equal(next);
			});
		});
		describe("when this Vertex's 'next' property is set", function() {
			it("should set the 'previous' property of this Vertex's 'next' property to be the Vertex given by this Vertex's 'previous' property.", function() {
				let v = vertices;
				var prev = v[1]._previous;	// v[0]
				var next = v[1]._next;			// v[2]
				v[1].remove();
				expect(next._previous).to.equal(prev);
			});
		});
	});

	describe("#upstream", function() {
		it("should return an array.", function() {
			var v = new Vertex(0);
			expect(v.upstream).to.be.an('array');
		});
		it("should contain each Vertex which connects to this Vertex by an Edge.", function() {
			mockupChain();
			expect(vertices[5].upstream).to.eql([ vertices[4], vertices[0] ]);
		});
	});	

	describe("#downstream", function() {
		it("should return an array.", function() {
			var v = new Vertex(0);
			expect(v.upstream).to.be.an('array');
		});
		it("should contain each Vertex to which this Vertex connects by an Edge.", function() {
			mockupChain();
			expect(vertices[0].downstream).to.eql([ vertices[2], vertices[4], vertices[5] ]);
		});
	});

	describe("#reflow", function() {
		it('should move all downlinks which are before this vertex after this vertex.', function() {
			mockupChain();
		});
	});

	describe("#connect()", function() {
		beforeEach(mockupChain);
		afterEach(teardownChain);
		describe('when no arguments are supplied.', function() {
			it('should throw an error.', function() {
				let fn = function() { vertices[0].connect(); };
				expect(fn).to.throw(Error);
			});
		});
		describe('when the first argument is supplied.', function() {
			it("should throw an error when the first argument is not a Vertex.", function() {
				let fn = function() { vertices[0].connect("abc"); };
				expect(fn).to.throw(Error);
			});
			it("should throw an error when the given Vertex is a member of this Vertex's upstream.", function() {
				let fn = function() { vertices[5].connect(vertices[0]); };
				expect(fn).to.throw(Error);
			});
			it("should return an instance of Edge.", function() {
				let e = vertices[0].connect(vertices[2]);
				expect(e).to.be.an.instanceOf(Edge);
			});
			it("should set the 'from' property of the returned Edge to this vertex.", function() {
				let e = vertices[0].connect(vertices[2]);
				expect(e).to.have.property("from", vertices[0]);
			});
			it("should set the 'to' property of the returned Edge to the given vertex.", function() {
				let e = vertices[0].connect(vertices[2]);
				expect(e).to.have.property("to", vertices[2]);
			});
			it("should add the returned edge to this vertex's list of downlinks.", function() {
				let e = vertices[0].connect(vertices[2]);
				expect(vertices[0]._downlinks).to.include(e);
			});
			it("should add the returned edge to the target vertex's list of uplinks.", function() {
				let e = vertices[0].connect(vertices[2]);
				expect(vertices[2]._uplinks).to.include(e);
			});
			describe("when the given Vertex is above this Vertex in the trunk.", function() {
				it("should move this Vertex before the given Vertex", function() {
					let e = vertices[4].connect(vertices[1]);
					expect(vertices[4]._next).to.equal(vertices[1]);
				});
			});
		});
	});

	describe("static #sort()", function() {
		it("should return an array of Vertices sorted by id.");
	});

});
