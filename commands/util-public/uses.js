const Command = require('../../framework/Command');
const { formatNumber } = require('../../util/Util');

module.exports = class UsesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'uses',
			aliases: ['command-uses', 'cmd-uses'],
			group: 'util-public',
			description: 'Responds with a command\'s usage stats.',
			guarded: true,
			args: [
				{
					key: 'command',
					type: 'command',
					default: ''
				}
			]
		});
	}

	run(msg, { command }) {
		if (!command) {
			const uses = formatNumber(this.client.registry.totalUses);
			return msg.say(`All commands have been used a total of **${uses}** times.`);
		}
		if (command.unknown || command.uses === undefined) {
			return msg.reply('That command\'s usage stats aren\'t being tracked.');
		}
		if (command.ownerOnly && !this.client.isOwner(msg.author)) {
			return msg.reply(`The \`${command.name}\` command can only be used by the bot owner(s).`);
		}
		return msg.say(`The \`${command.name}\` command has been used **${formatNumber(command.uses)}** times.`);
	}
};
