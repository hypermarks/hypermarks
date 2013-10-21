/**
 * Test for elmongo helpers (lib/helpers.js)
 */
var helpers = require('../lib/helpers'),
	ObjectID = require('mongodb').ObjectID,
	assert = require('assert')

describe('elmongo helpers', function () {
	it('`helpers.serialize` leaves primitives and null untouched', function (done) {
        assert.equal(undefined, helpers.serialize(undefined))
        assert.equal(null, helpers.serialize(null))
        assert.equal(true, helpers.serialize(true))
        assert.equal(false, helpers.serialize(false))
        assert.equal('a', helpers.serialize('a'))
        assert.equal(10, helpers.serialize(10))

        var date = new Date()
        assert.equal(date.toISOString(), helpers.serialize(date))

        done()
    })

    it('`helpers.serialize` converts object ids to strings in deeply nested objects', function (done) {
        var bStr = '111100000000000000000000',
            dStr = '111100000000000000000001',
            fStr1 = '111100000000000000000002',
            fStr2 = '111100000000000000000003',
            hStr = '111100000000000000000004'

        var doc = {
            a: 10,
            b: new ObjectID(bStr),
            c: {
                d: new ObjectID(dStr),
                e: 5,
                f: [ new ObjectID(fStr1), new ObjectID(fStr2) ],
                g: [
                    {
                        h: new ObjectID(hStr),
                        i: 'hello'
                    }
                ]
            }
        }

        var serialized = helpers.serialize(doc)

        assert.equal(serialized.a, doc.a)
        assert.equal(serialized.b, bStr)

        assert.equal(serialized.c.d, dStr)
        assert.equal(serialized.c.e, doc.c.e)
        assert.equal(serialized.c.f[0], fStr1)
        assert.equal(serialized.c.f[1], fStr2)
        assert.equal(serialized.c.g[0].h, hStr)
        assert.equal(serialized.c.g[0].i, 'hello')

        done()
    })
})