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
}

/**
 * Gets the previous vertex in the trunk.
 */
get previous() { return this._previous; }

/**
 * Gets the next vertex in the trunk.
 */
get next() { return this._next; }

/**
 * Inserts the given vertex directly above this vertex in the trunk.
 */
insertAbove(target) {
	if (!(target instanceof Vertex)) {
		throw new Error("target is not a Vertex.");
	}
	target._previous = this._previous;
	if (this._previous) {
		this._previous._next = target;
	}
	this._previous = target;
	target._next = this;
}

}

exports = module.exports = Vertex;
