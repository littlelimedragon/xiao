const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');

module.exports = class JeopardyQuestionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'jeopardy-question',
			aliases: ['clue-card', 'jeopardy-clue-card', 'jeopardy-clue'],
			group: 'edit-image-text',
			description: 'Sends a Jeopardy Question with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Jeopardy',
					url: 'https://www.jeopardy.com/',
					reason: 'Original Show'
				},
				{
					name: 'OPTIFONT',
					url: 'http://opti.netii.net/',
					reason: 'Korinna Agency Font',
					reasonURL: 'https://fontmeme.com/fonts/korinna-agency-font/'
				},
				{
					name: 'DrewManDew',
					url: 'https://www.deviantart.com/drewmandew/gallery',
					reason: 'Blank Background Image',
					reasonURL: 'https://www.deviantart.com/drewmandew/art/Blank-Jeopardy-Screen-780893853'
				}
			],
			args: [
				{
					key: 'text',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { text }) {
		const attachment = await this.client.registry.commands.get('jeopardy').generateClueCard(text);
		return msg.say({ files: [{ attachment, name: 'jeopardy-question.png' }] });
	}
};
