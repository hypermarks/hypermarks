/**
 * This file contains mongoose models used in elmongo tests
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	elmongo = require('../lib/elmongo')

/**
* Model definition
*/

var Cat = new Schema({
	name: { type: String, autocomplete: true },
	age: { type: Number },
	breed: { type: String },
	toys: [ { type: String } ],
	owner: { type: ObjectId, ref: 'Person' },
	nicknames: [ { type: String, autocomplete: true } ],
	friends: [ { type: ObjectId, ref: 'Cat' } ],
	isHappy: { type: Boolean }
})

Cat.plugin(elmongo)

var Person = new Schema({
	name: { type: String },
	email: { type: String },
	siblings: {
		brothers: [ { type: ObjectId, ref: 'Person' } ],
		sisters: [ { type: ObjectId, ref: 'Person' } ],
	},
	parents: {
		mother: { type: ObjectId, ref: 'Person' },
		father: { type: ObjectId, ref: 'Person' }
	}
})

Person.plugin(elmongo)

exports.Cat = mongoose.model('Cat', Cat)
exports.CatSchema = Cat

exports.Person = mongoose.model('Person', Person)
exports.PersonSchema = Person
