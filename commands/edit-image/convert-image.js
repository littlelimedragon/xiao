const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const formats = {
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	png: 'image/png'
};

module.exports = class ConvertImageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'convert-image',
			aliases: ['convert-img', 'image-convert', 'img-convert'],
			group: 'edit-image',
			description: 'Converts an image from one format to another.',
			details: `**Formats:** ${Object.keys(formats).join(', ')}`,
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			args: [
				{
					key: 'format',
					type: 'string',
					oneOf: Object.keys(formats),
					parse: format => format.toLowerCase()
				},
				{
					key: 'image',
					type: 'image'
				}
			]
		});
	}

	async run(msg, { format, image }) {
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		const attachment = canvas.toBuffer(formats[format]);
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: `convert-image.${format}` }] });
	}
};
