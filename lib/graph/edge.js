/**
 * Represents an edge between two Vertices.
 */
class Edge {

/**
 * Instantiates a new instance of Edge with the given from and to Vertices.
 */
constructor(from, to) {
	this._from = from;
	this._to = to;
}

/** Gets the vertex this edge moves from. */
get from() { return this._from; }

/** Gets the vertex this edge moves to. */
get to() { return this._to; }

/**
 * Inserts the given edge into the given array such that the array is ordered by the vertex id of
 * the 'to' edge.
 */
static insert(arr, edge) {
	var len = arr.length;
	for (let i = 0; i < len; i++) {
		if (edge.from._id === arr[i].from._id) {
			if (edge.to._id === arr[i].to._id) {
				return -1;
			}
		}
		if (edge.from._id <= arr[i].from._id) {
			if (edge.to._id < arr[i].to._id) {
				return arr.splice(i, 0, edge);
			}
		}
	}
	arr.push(edge);
}

}

exports = module.exports = Edge;
