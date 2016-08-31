var _ = require('lodash');

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

/** Gets the previous vertex in the trunk. */
get previous() { return this._previous; }

/** Gets the first vertex in the trunk. */
get first() { return this._previous ? this._previous.first : this; }

/** Gets the next vertex in the trunk. */
get next() { return this._next; }

/** Retrieves the last vertex in the trunk. */
get last() { return this._next ? this._next.last : this; }

get upstream() { return []; }

/**
 * Inserts the given vertex directly above this vertex in the trunk.
 */
insertAbove(target) {
	if (!(target instanceof Vertex)) {
		throw new Error("target is not a Vertex.");
	}
	var prev = this._previous;
	var last = this._previous = target.last;
	last._next = this;
	var first = target.first;
	first._previous = prev;
	if (prev) {
		prev._next = first;
	}
}

/**
 * Inserts the given vertex directly above this vertex in the trunk.
 */
insertBelow(target) {
	var next = this._next;
	var first = this._next = target.first;
	first._previous = this;
	var last = target.last;
	last._next = next;
	if (next) {
		next._previous = last;
	}
}

/**
 * Returns true if the given vertex is above this vertex in the trunk.
 */
isAbove(target) {
	if (!(target instanceof Vertex)) {
		throw new Error("target is not a Vertex.");
	}
	if (this._previous === undefined) {
		return false;
	}
	return _.isEqual(this._previous, target) || this._previous.isAbove(target);
}

/**
 * Returns true if the given vertex is above this vertex in the trunk.
 */
isBelow(target) {
	return target.isAbove(this);
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
	return this;
}

}

exports = module.exports = Vertex;
