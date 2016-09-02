var _ = require('lodash');
var Edge = require('./edge.js');

/**
 *	Represents a single vertex within a graph.
 *	@class
 */
class Vertex {

/**
 * Instantiates a new instance of Vertex.
 * @param {Number} id The id number to give the Vertex.
 */
constructor(id) {
	if (typeof id !== "number") {
		throw new Error("id must be a number");
	}
	this._id = id;
	this._uplinks = [];
	this._downlinks = [];
}

/** Static reference to Edge. */
static get Edge() { return Edge; }

/** Gets the previous vertex in the trunk. */
get previous() { return this._previous; }

/** Gets the first vertex in the trunk. */
get first() { return this._previous ? this._previous.first : this; }

/** Gets the next vertex in the trunk. */
get next() { return this._next; }

/** Retrieves the last vertex in the trunk. */
get last() { return this._next ? this._next.last : this; }

/** 
 * Retrieves an array of vertices which connect directly or indirectly to this vertex 
 * by an Edge. 
 */
get upstream() {
	var vertices = [];
	this._uplinks.forEach((edge) => {
		Vertex.insert(vertices, edge.from);
		Vertex.insertAll(vertices, edge.from.upstream);
	});
	return vertices;
}

/** 
 * Retrieves an array of vertices which connect directly or indirectly to this vertex 
 * by an Edge. 
 */
get downstream() {
	var vertices = [];
	this._downlinks.forEach((edge) => {
		Vertex.insertAll(vertices, [ edge.to, ...edge.to.downstream ]);
	});
	return vertices;
}

/**
 * Inserts the given vertex directly above this vertex in the trunk.
 */
insertBefore(target) {
	if (!(target instanceof Vertex)) {
		throw new Error("target is not a Vertex.");
	}
	target.remove();
	var previous = this._previous;
	(this._previous = target)._next = this;
	if ((target._previous = previous)) {
		previous._next = target;
	}
	target.reflow();
}

/**
 * Inserts the given vertex directly above this vertex in the trunk.
 */
insertAfter(target) {
	if (!(target instanceof Vertex)) {
		throw new Error("target is not a Vertex.");
	}
	target.remove();
	var next = this._next;
	(this._next = target)._previous = this;
	if ((target._next = next)) {
		next._previous = target;
	}
	target.reflow();
}

/**
 * Re-orders the dependant vertices of this vertex such that the graph remains in partial order.
 */
reflow(pointer) {
	pointer = pointer || this;
	let len = this._downlinks.length;
	for (let i = 0; i < len; i++) {
		let edge = this._downlinks[i];
		// If the vertex at the end of the selected edge is above this vertex, insert it directly after
		// the pointer.
		if (edge.to.isBefore(this)) {
			pointer.insertAfter(edge.to);
			pointer = edge.to;
		}
	}
	return pointer;
}

/**
 * Returns true if this vertex is before the given vertex in the trunk.
 */
isBefore(target) {
	if (!(target instanceof Vertex)) {
		throw new Error("target is not a Vertex.");
	}
	if (this._next === undefined) {
		return false;
	}
	return _.isEqual(this._next, target) || this._next.isBefore(target);
}

/**
 * Returns true if this vertex is after the given vertex in the trunk.
 */
isAfter(target) {
	return target.isBefore(this);
}

/**
 * Removes this vertex from the trunk and stitches it together.
 */
remove() {
	var next = this._next;
	var prev = this._previous;
	if (prev) {
		prev._next = next;
	}
	if (next) {
		next._previous = prev;
	}
	this._next = undefined;
	this._previous = undefined;
	return this;
}

/**
 * Connects this vertex to the given vertex and returns the new Edge.
 */
connect(target) {
	if (!(target instanceof Vertex)) {
		throw new Error("target is not a Vertex.");
	}
	var isUpstream = _.some(this.upstream, function(vertex) {
		return _.isEqual(target, vertex);
	});
	if (isUpstream) {
		throw new Error("target cannot be a member of this vertex's upstream.");
	}
	// If the target comes before this vertex, move it to after this one.
	if (this.isAfter(target)) {
		this.insertAfter(target);
	}
	var edge = new Edge(this, target);
	Edge.insert(this._downlinks, edge);
	Edge.insert(target._uplinks, edge);
	return edge;
}

/**
 * Inserts the given vertex into the given array of vertices such that the array is sorted by
 * vertex id.  If the given vertex already exists in the array, then no action is taken.
 */
static insert(arr, vertex) {
	let len = arr.length;
	for (let i = 0; i < len; i++) {
		if (vertex._id == arr[i]._id) {
			return -1;
		}
		if (vertex._id < arr[i]._id) {
			arr.splice(i, 0, vertex);
			return i;
		}
	}
	return arr.push(vertex);
}

/**
 * Inserts the given vertices into the given array of vertices such that the array is sorted by
 * vertex id.  Any vertices which already exist in the array are not added again.
 */
static insertAll(arr, vertices) {
	_.castArray(vertices);
	vertices.forEach((vertex) => {
		Vertex.insert(arr, vertex);
	});
}

}	/** Vertex */

exports = module.exports = Vertex;
