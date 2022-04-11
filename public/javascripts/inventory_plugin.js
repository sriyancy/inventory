const moment = require('moment');
function inventory(options) {
	this.add({ role: 'inventory', op: 'view' }, (args, reply) => {
		const item = this.make('inventory');
		item.list$({}, (err, items) => {
            if (err) return console.log(err);
			reply(null, { result: items });
		});
	});
	this.add({ role: 'inventory', op: 'type' }, (args, reply) => {
		const item = this.make('inventory');
		item.list$({ itemId: parseInt(args.msg) }, (err, item) => {
			if (err) return console.log(err);
			reply(null, { result: item });
		});
	});
	this.add({ role: 'inventory', op: 'sort_last' }, (args, reply) => {
		const item = this.make('inventory');
		item.list$({ sort$: { itemId: -1 }, limit$: 1 }, (err, item) => {
			if (err) return console.log('err', err);
			else {
				id = item[0].itemId;
			}
			reply(null, { result: { id, item } });
		});
	});
	this.add({ role: 'inventory', op: 'sort' }, (args, reply) => {
		const item = this.make('inventory');
		item.list$({ itemId: parseInt(args.id) }, (err, item) => {
			if (err) return console.log('err', err);

			reply(null, { result: item });
		});
	});
	this.add({ role: 'inventory', op: 'add' }, (args, reply) => {
		const item = this.make('inventory');
		args.body.itemId = args.id + 1;
		args.body.quantityDate = moment().format('DDMMMyyyy');
		resp = {
			itemId: args.body.itemId,
			title: args.body.title,
			status: 'added',
		};
		newItem = {
			itemId: args.body.itemId,
			title: args.body.title,
			type: args.body.type,
			description: args.body.description,
			price: args.body.price,
			quantity: args.body.quantity,
			quantityDate: args.body.quantityDate,
		};
		item.save$(newItem, (err, item) => {
			if (err) return console.log(err);
			reply(null, {
				result: { result1: resp },
			});
		});
	});
	this.add({ role: 'inventory', op: 'delete' }, (args, reply) => {
		const item = this.make('inventory');
		res = {
			itemId: args.data.itemId,
			title: args.data.title,
			response: 'deleted',
		};

		item.remove$({ itemId: parseInt(args.data.itemId) }, (err) => {
			if (err) return console.log('err', err);
			reply(null, { result: res });
		});
	});
	this.add({ role: 'inventory', op: 'update' }, (args, reply) => {
		const item = this.make('inventory');
		res = {
			itemId: args.body.itemId,
			title: args.body.title,
			response: 'updated',
		};
		item.list$({ itemId: parseInt(args.body.itemId) }, (err, items) => {
			if (err) return console.log('err', err);
			args.body.quantityDate = moment().format('DDMMMyyyy');
			item.remove$({ itemId: parseInt(args.body.itemId) }, (err) => {
				if (err) return console.log('err', err);
				newItem = {
					itemId: args.body.itemId,
					title: args.body.title,
					type: args.body.type,
					description: args.body.description,
					price: args.body.price,
					quantity: args.body.quantity,
					quantityDate: args.body.quantityDate,
				};
				item.save$(newItem, (err, newITem) => {
					if (err) return console.log(err);
					reply(null, { result: res });
				});
			});
		});
	});
}

module.exports = inventory;