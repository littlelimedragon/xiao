const Command = require('../../framework/Command');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { stripIndents } = require('common-tags');

module.exports = class ExecCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'exec',
			aliases: ['execute', '$'],
			group: 'util',
			memberName: 'exec',
			description: 'Executes a command-line application.',
			ownerOnly: true,
			guarded: true,
			args: [
				{
					key: 'command',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { command }) {
		const results = await this.exec(command);
		return msg.reply(stripIndents`
			_${results.err ? 'An error occurred:' : 'Successfully executed.'}_
			\`\`\`sh
			${results.std}
			\`\`\`
		`);
	}

	async exec(command) {
		try {
			const { stdout } = await execAsync(command, { timeout: 30000, encoding: 'utf8' });
			return { err: false, std: stdout.trim() };
		} catch (err) {
			return { err: true, std: err.stderr.trim() };
		}
	}
};
