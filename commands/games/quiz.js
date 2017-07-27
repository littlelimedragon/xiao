const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const snekfetch = require('snekfetch');

module.exports = class QuizCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'quiz',
			aliases: ['jeopardy'],
			group: 'games',
			memberName: 'quiz',
			description: 'Answer a true/false quiz question.',
			clientPermissions: ['EMBED_LINKS']
		});
	}

	async run(msg) {
		const { body } = await snekfetch
			.get('https://opentdb.com/api.php')
			.query({
				amount: 1,
				type: 'boolean',
				encode: 'url3986'
			});
		const answer = body.results[0].correct_answer.toLowerCase();
		const embed = new MessageEmbed()
			.setTitle('You have 15 seconds to answer this question:')
			.setDescription(stripIndents`
				**${decodeURIComponent(body.results[0].category)}**
				True or False: ${decodeURIComponent(body.results[0].question)}
			`);
		await msg.embed(embed);
		const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
			max: 1,
			time: 15000
		});
		if (!msgs.size) return msg.say(`Time! It was ${answer}, sorry!`);
		if (msgs.first().content.toLowerCase() !== answer) return msg.say(`Nope, sorry, it's ${answer}.`);
		return msg.say('Nice job! 10/10! You deserve some cake!');
	}
};
