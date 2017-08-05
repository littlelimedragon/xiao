const Command = require('../../structures/Command');
const { createCanvas } = require('canvas');

module.exports = class ColorCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'color',
			group: 'image-edit',
			memberName: 'color',
			description: 'Sends an image of the color you choose.',
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'color',
					prompt: 'What color do you want to view? This can be HTML (#colorcode) or a name.',
					type: 'string',
					parse: color => color.toLowerCase()
				}
			]
		});
	}

	run(msg, args) {
		const { color } = args;
		const canvas = createCanvas(250, 250);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, 250, 250);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'color.png' }] });
	}
};
