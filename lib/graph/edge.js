class Edge {
	constructor(from, to) {
		this._from = from;
		this._to = to;
	}
	get from() { return this._from; }
	get to() { return this._to; }
}