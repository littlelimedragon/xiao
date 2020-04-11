const Command = require('../Command');

module.exports = class AutoReplyCommand extends Command {
	constructor(client, info) {
		super(client, info);

		this.reply = info.reply || false;
	}

	run(msg, args, fromPattern) {
		if (this.client.botListGuilds.includes(msg.guild.id)) return null;
		return this.reply ? msg.reply(this.generateText(fromPattern)) : msg.say(this.generateText(fromPattern));
	}

	generateText() {
		throw new Error('The generateText method is required.');
	}
};
