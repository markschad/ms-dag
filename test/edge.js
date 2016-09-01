var expect = require("chai").expect;
var Edge = require("../lib/graph/edge.js");

describe("Edge", function() {
	describe("static #insert()", function() {
		var arr, vertices;
		beforeEach(function() {
			var v = (vertices = []);
			for (let i = 0; i < 6; i++) {
				v.push({ _id: i });	// Mock a vertex.
			}
			/**
			 *      +-----------v---v
			 * 	0 > 1 > 2 > 3 > 4 > 5
			 *  +-----------^-------^
			 */
			arr = [
				new Edge(v[0], v[3]),
				new Edge(v[0], v[5]),
				new Edge(v[1], v[4]),
				new Edge(v[2], v[5]),
			];
		});
		afterEach(function() { arr = null; });
		it("should not insert a duplicate item.", function() {
			Edge.insert(arr, new Edge(vertices[1], vertices[4]));
			expect(arr).to.have.length(4);
		});
		it("should prioritise the 'from' id over the to 'id'.", function() {
			let e = new Edge(vertices[0], vertices[4]);
			Edge.insert(arr, e);
			expect(arr[1]).to.equal(e);
		});
	});
});
