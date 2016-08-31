var _ = require('lodash');
var expect = require("chai").expect;
var Vertex = require("../lib/graph/vertex.js");

describe("Vertex", function() {

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

	describe("#insertAbove()", function() {
		describe("when no arguments are supplied", function() {
			it("should throw an error if the first argument is not a Vertex.", function() {
				let v = new Vertex(0);
				let fn = function() { return v.insertAbove("abc"); };
				expect(fn).to.throw(Error);
			});
		});
		describe("when the first argument is supplied.", function() {
			var v0, v1, v2;
			beforeEach(function() {
				v0 = new Vertex(0);
				v1 = new Vertex(1);
				v2 = new Vertex(2);
				// Initial: v0 > v1
				v0._next = v1;
				v1._previous = v0;
				// Modified: v0 > v2 > v1
				v1.insertAbove(v2);
			});
			it("should set the 'next' property of the given vertex's 'last' to be this vertex.", function() {			
				expect(v2.next).to.equal(v1);
			});
			it("should set the given Vertex's 'previous' property to be this Vertex's 'previous'", function() {
				expect(v2.previous).to.equal(v0);
			});
			it("should set this vertex's 'previous' property to be the given Vertex.", function() {
				expect(v1.previous).to.equal(v2);
			});
			describe("when this vertex's 'previous' property is already set", function() {
				it("should set the 'next' property of this Vertex's 'previous' to be the given vertex's 'first'.", function() {
					expect(v0.next).to.equal(v2);
				});
			});
		});
	});

	describe("#insertBelow()", function() {
		describe("when no arguments are supplied", function() {
			it("should throw an error if the first argument is not a Vertex.", function() {
				let v = new Vertex(0);
				let fn = function() { return v.insertBelow("abc"); };
				expect(fn).to.throw(Error);
			});
		});
		describe("when the first argument is supplied.", function() {
			var v0, v1, v2;
			beforeEach(function() {
				v0 = new Vertex(0);
				v1 = new Vertex(1);
				v2 = new Vertex(2);
				// Initial: v0 > v1
				v0._next = v1;
				v1._previous = v0;
				// Modified: v0 > v2 > v1
				v0.insertBelow(v2);
			});
			it("should set the given Vertex's 'previous' property to be this Vertex.", function() {			
				expect(v2.previous).to.equal(v0);
			});
			it("should set the given Vertex's 'next' property to be this Vertex's 'next'", function() {
				expect(v2.next).to.equal(v1);
			});
			it("should set this Vertex's 'next' property to be the given Vertex.", function() {
				expect(v0.next).to.equal(v2);
			});
			describe("when this Vertex's 'next' property is already set", function() {
				it("should set the 'previous' property of this Vertex's 'next' to be the given Vertex.", function() {
					expect(v0.next).to.equal(v2);
				});
			});
		});
	});

	describe("#isAbove()", function() {
		it("should throw an error when the first argument is not a Vertex.", function() {
			let v = new Vertex(0);
			let fn = function() { return v.isAbove("abc"); };
			expect(fn).to.throw(Error);
		});
		it("should return true when the given Vertex is above this Vertex.", function() {
			let v0 = new Vertex(0);
			let v1 = new Vertex(1);
			let v2 = new Vertex(2);
			let v3 = new Vertex(3);
			// v0 > v1 > v2 > b3
			v0.insertBelow(v1);
			v1.insertBelow(v2);
			v2.insertBelow(v3);
			expect(v2.isAbove(v1)).to.be.true;	// jshint ignore:line
		});
		it("should return false when the given Vertex is not above this Vertex.", function() {
			let v0 = new Vertex(0);
			let v1 = new Vertex(1);
			let v2 = new Vertex(2);
			let v3 = new Vertex(3);
			// v0 > v1 > v2 > b3
			v0.insertBelow(v1);
			v1.insertBelow(v2);
			v2.insertBelow(v3);
			expect(v2.isAbove(v3)).to.be.false;	// jshint ignore:line
		});
	});

	describe("#isBelow()", function() {
		it("should throw an error when the first argument is not a Vertex.", function() {
			let v = new Vertex(0);
			let fn = function() { return v.isBelow("abc"); };
			expect(fn).to.throw(Error);
		});
		it("should return true when the given Vertex is below this Vertex.", function() {
			let v0 = new Vertex(0);
			let v1 = new Vertex(1);
			let v2 = new Vertex(2);
			let v3 = new Vertex(3);
			// v0 > v1 > v2 > b3
			v0.insertBelow(v1);
			v1.insertBelow(v2);
			v2.insertBelow(v3);
			expect(v1.isBelow(v2)).to.be.true;	// jshint ignore:line
		});
		it("should return false when the given Vertex is not below this Vertex.", function() {
			let v0 = new Vertex(0);
			let v1 = new Vertex(1);
			let v2 = new Vertex(2);
			let v3 = new Vertex(3);
			// v0 > v1 > v2 > b3
			v0.insertBelow(v1);
			v1.insertBelow(v2);
			v2.insertBelow(v3);
			expect(v2.isBelow(v1)).to.be.false;	// jshint ignore:line
		});
	});

	describe("remove()", function() {
		it("should return this Vertex.", function() {
			let v = new Vertex(0);
			expect(v.remove()).to.equal(v);
		});
		describe("when this Vertex's 'previous' property is set", function() {
			it("should set the 'next' property of this Vertex's 'previous' property to be the Vertex given by this Vertex's 'next' property.", function() {
				let v0 = new Vertex(0);
				let v1 = new Vertex(1);
				let v2 = new Vertex(2);
				// v0 > v1 > v2
				v0.insertBelow(v1);
				v1.insertBelow(v2);
				var prev = v1._previous;	// v0
				var next = v1._next;			// v2
				v1.remove();
				expect(prev._next).to.equal(next);
			});
		});
		describe("when this Vertex's 'next' property is set", function() {
			it("should set the 'previous' property of this Vertex's 'next' property to be the Vertex given by this Vertex's 'previous' property.", function() {
				let v0 = new Vertex(0);
				let v1 = new Vertex(1);
				let v2 = new Vertex(2);
				// v0 > v1 > v2
				v0.insertBelow(v1);
				v1.insertBelow(v2);
				var prev = v1._previous;	// v0
				var next = v1._next;			// v2
				v1.remove();
				expect(next._previous).to.equal(prev);
			});
		});
	});
	
	describe("#upstream", function() {
		it("should return an array.", function() {
			var v = new Vertex(0);
			expect(v.upstream).to.be.an('array');
		});
		it("should contain each Vertex which connects to this Vertex by an Edge.");
	});

	describe("#downstream", function() {
		it("should return an array.");
		it("should contain each Vertex to which this Vertex connects by an Edge.");
	});

	describe("#connect()", function() {
		describe('when no arguments are supplied.', function() {
			it('should throw an error.');
		});
		describe('when the first argument is supplied.', function() {
			it("should throw an error when the first argument is not a Vertex.");
			it("should throw an error when the given Vertex is a member of this Vertex's upstream.");
			it("should return an instance of Edge.");
		});
		describe("when the given Vertex is above this Vertex in the trunk.", function() {
			it("should move this Vertex before the given Vertex");
		});
	});

	describe("static #sort()", function() {
		it("should return an array of Vertices sorted by id.");
	});

});
