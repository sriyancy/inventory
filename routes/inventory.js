var express = require('express');
var router = express.Router();
var inventory = require('../public/javascripts/inventory_plugin');
const seneca = require('seneca')();
const entities = require('seneca-entity');
const mongo_store = require('seneca-mongo-store');
seneca
	.quiet()
	.use(entities)
	.use(mongo_store, { name: 'InstaGrocer', host: '127.0.0.1', port: 27017 })
	.use(inventory);
/* GET users listing. */
router.get('/items', function (req, res, next) {
	var response;
	seneca.client({ type: 'tcp', pin: 'role:inventory' });

	seneca
		.act({ role: 'inventory', op: 'view' }, (err, res) => {
			if (err) {
				console.log('err', err);
			} else {
				response = res.result;
			}
		})
		.ready(function () {
			res.send(response);
		});
});
router.get('/item', function (req, res, next) {
	var response;

	seneca
		.act(
			{ role: 'inventory', op: 'type', msg: req.query.itemid },
			(err, res) => {
				if (err) {
					console.log('err', err);
				} else {
					response = res;
				}
			}
		)
		.ready(function () {
			res.send(response);
		});
});
router.post('/item', async (req, res, next) => {
	seneca.client({
		type: 'tcp',
		pin: 'role:inventory',
	});
	await seneca
		.act(
			{
				role: 'inventory',
				op: 'sort_last',
			},
			(err, res) => {
				if (err) {
					console.log('err', err);
				} else {
					id = res.result.id;
				}
			}
		)

		.ready(async function () {
			await this.act(
				{
					role: 'inventory',
					op: 'add',
					body: req.body,
					id: id,
				},
				(err, res) => {
					if (err) {
						console.log('err', err);
					} else {
						response = res.result.result1;
					}
				}
			).ready(function () {
				res.json({ response });
			});
		});
});
router.delete('/item/:itemId', async (req, res, next) => {
	seneca.client({ type: 'tcp', pin: 'role:inventory' });

	await seneca
		.act(
			{
				role: 'inventory',
				op: 'sort',
				id: req.params.itemId,
			},
			(err, res) => {
				if (err) {
					console.log('err', err);
				} else {
					data = res.result[0];
				}
			}
		)

		.ready(async function () {
			if (!data) {
				res.json('Provided itemId doesnt exists!!');
			} else {
				await this.act(
					{
						role: 'inventory',
						op: 'delete',
						data: data,
					},
					(err, res) => {
						if (err) {
							console.log('err', err);
						} else {
							RESPONSE = res.result;
						}
					}
				).ready(function () {
					res.json({ RESPONSE });
				});
			}
		});
});
router.put('/item', async (req, res, next) => {
	seneca.client({
		type: 'tcp',
		pin: 'role:inventory',
	});
	await seneca
		.act(
			{
				role: 'inventory',
				op: 'update',
				body: req.body,
			},
			(err, res) => {
				if (err) {
					console.log('err', err);
				} else {
					RESPONSE = res.result;
				}
			}
		)

		.ready(async function () {
			res.json({ RESPONSE });
		});
});

module.exports = router;