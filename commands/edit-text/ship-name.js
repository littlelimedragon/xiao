const Command = require('../../framework/Command');

module.exports = class ShipNameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ship-name',
			group: 'edit-text',
			description: 'Creates a ship name from two names.',
			args: [
				{
					key: 'start',
					label: 'start name',
					type: 'string',
					max: 500,
					parse: start => start.toLowerCase()
				},
				{
					key: 'end',
					label: 'end name',
					type: 'string',
					max: 500,
					parse: end => end.toLowerCase()
				}
			]
		});
	}

	run(msg, { start, end }) {
		return msg.say(`${start.slice(0, Math.floor(start.length / 2))}${end.slice(Math.floor(end.length / 2))}`);
	}
};
