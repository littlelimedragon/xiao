const Command = require('../../framework/Command');
const { stripIndents } = require('common-tags');
const { delay, randomRange, verify, fetchHSUserDisplay } = require('../../util/Util');
const words = ['fire', 'draw', 'shoot', 'bang', 'pull', 'boom'];

module.exports = class GunfightCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gunfight',
			aliases: ['western-gunfight'],
			group: 'games-mp',
			description: 'Engage in a western gunfight against another user. High noon.',
			guildOnly: true,
			game: true,
			args: [
				{
					key: 'opponent',
					type: 'user'
				}
			]
		});
	}

	async run(msg, { opponent }) {
		if (opponent.bot) return msg.reply('Bots may not be fought.');
		if (opponent.id === msg.author.id) return msg.reply('You may not fight yourself.');
		if (this.client.blacklist.user.includes(opponent.id)) return msg.reply('This user is blacklisted.');
		await msg.say(`${opponent}, do you accept this challenge?`);
		const verification = await verify(msg.channel, opponent);
		if (!verification) return msg.say('Looks like they declined...');
		await msg.say('Get Ready...');
		await delay(randomRange(1000, 30000));
		const word = words[Math.floor(Math.random() * words.length)];
		await msg.say(`TYPE \`${word.toUpperCase()}\` NOW!`);
		const filter = res => [opponent.id, msg.author.id].includes(res.author.id) && res.content.toLowerCase() === word;
		const now = Date.now();
		const winner = await msg.channel.awaitMessages({
			filter,
			max: 1,
			time: 30000
		});
		const newScore = Date.now() - now;
		const highScoreGet = await this.client.redis.db.get('reaction-time');
		const highScore = highScoreGet ? Number.parseInt(highScoreGet, 10) : null;
		const highScoreUser = await this.client.redis.db.get('reaction-time-user');
		const scoreBeat = !highScore || highScore > newScore;
		const user = await fetchHSUserDisplay(this.client, highScoreUser);
		if (scoreBeat) {
			await this.client.redis.db.set('reaction-time', newScore);
			await this.client.redis.db.set('reaction-time-user', winner.first().author.id);
		}
		if (!winner.size) return msg.say('Oh... No one won.');
		return msg.say(stripIndents`
			The winner is ${winner.first().author}! (Took ${newScore / 1000} seconds)
			${scoreBeat ? `**New High Score!** Old:` : `High Score:`} ${highScore / 1000} (Held by ${user})
		`);
	}
};
