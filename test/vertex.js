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
			it("should set the given Vertex's 'next' property to be this Vertex.", function() {			
				expect(v2.next).to.equal(v1);
			});
			it("should set the given Vertex's 'previous' property to be this Vertex's 'previous'", function() {
				expect(v2.previous).to.equal(v0);
			});
			it("should set this Vertex's 'previous' property to be the given Vertex.", function() {
				expect(v1.previous).to.equal(v2);
			});
			describe("when this Vertex's 'previous' property is set", function() {
				it("should set the 'next' property of this Vertex's 'previous' property to be the given Vertex.", function() {
					expect(v0.next).to.equal(v2);
				});
			});
		});
	});

	describe("insertBelow()", function() {
		it("should throw an error if the first argument is not a Vertex.");
		it("should set the given Vertex's 'previous' property to be this Vertex.");
		it("should set the given Vertex's 'next' property to be this Vertex's 'next'");
		it("should set this Vertex's 'next' property to be the given Vertex.");
		describe("when this Vertex's 'next' property is set", function() {
			it("should set the 'previous' property of this Vertex's 'next' property to be the given Vertex.");
		});
	});

	describe("#isAbove()", function() {
		it("should throw an error if the first argument is not a Vertex.", function() {
			let v = new Vertex(0);
			let fn = function() { return v.isAbove("abc"); };
			expect(fn).to.throw(Error);
		});
		it("should return true if the given Vertex is above this Vertex.");
		it("should return false if the given Vertex is not above this Vertex.");
	});

	describe("#isBelow()", function() {
		it("should throw an error if the first argument is not a Vertex.");
		it("should return true if the given Vertex is below this Vertex.");
		it("should return false if the given Vertex is not below this Vertex.");
	});
	
	describe("#upstream", function() {
		it("should return an array.");
		it("should contain each Vertex which connects to this Vertex by an Edge.");
	});

	describe("#downstream", function() {
		it("should return an array.");
		it("should contain each Vertex to which this Vertex connects by an Edge.");
	});

	describe("remove()", function() {
		it("should return this Vertex.");
		describe("when this Vertex's 'previous' property is set", function() {
			it("should set the 'next' property of this Vertex's 'previous' property to be the Vertex given by this Vertex's 'next' property.");
		});
		describe("when this Vertex's 'next' property is set", function() {
			it("should set the 'previous' property of this Vertex's 'next' property to be the Vertex given by this Vertex's 'previous' property.");
		});
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
