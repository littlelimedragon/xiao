const { default: eslintPluginJsonc } = require('eslint-plugin-jsonc');
const { default: js } = require('@eslint/js');
const amber = require('eslint-config-amber');

module.exports = [
	...eslintPluginJsonc.configs['flat/recommended-with-json'],
	{
		files: ['**/*.js'],
		rules: {
			...js.configs.recommended.rules,
			...amber.rules
		}
	}
];
