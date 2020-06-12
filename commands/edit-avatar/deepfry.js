const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class DeepFryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'deepfry',
			aliases: ['deepfry'],
			group: 'edit-avatar',
			memberName: 'deepfry',
			description: 'deepfrys a users avatar',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'user',
					prompt: 'What user would you like to deepfry',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { user }) {
		try {
			msg.say('Deepfrying...');	
			const { body } = await request
			.get(`https://imggen.epfforce.tech/api/deepfry?avatar1=${user.displayAvatarURL({ format: 'png', size: 1024})}`)
			.set({"Authorization": "0c41f905becd918933388bd9c59eb51f5c50ef800b1f45b561f0c24f4a03a57d"});
			return msg.say({ files: [{ attachment: body, name: `deepfry.png` }] });    
	} catch (err) {
		return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
	}
}
};
