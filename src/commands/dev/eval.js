const Command = require('../../utilities/classes/Command.js');
const MessageUtil = require('../../utilities/classes/MessageUtil.js');
const Translation = require('../../utilities/classes/Translation.js');

const Discord = require('discord.js');
const tags = require('common-tags');
const escapeRegex = require('escape-string-regexp');
const util = require('util');

const nl = '!!NL!!';
const nlPattern = new RegExp(nl, 'g');

class Eval extends Command {
    constructor() {
        super('eval', ['e']);
        this.setDescription('Eval some code!');
        this.setUsage('<code>');
        this.setDevOnly(true);
    }

    async execute(message, args, client) {
        if (args.length < 1) return MessageUtil.sendWrongUsage(message.channel, this.getUsage(), 'eval 50 + 50');
        this.client = message.client;

        const doReply = val => {
            if (val instanceof Error) {
                message.reply(`Callback error: \`${val}\``);
            } else {
                const result = this.makeResultMessages(val, process.hrtime(this.hrStart));
                if (Array.isArray(result)) {
                    for (const item of result) message.reply(item);
                } else {
                    message.reply(result);
                }
            }
        };
        let hrDiff;

        try {
            const hrStart = process.hrtime();
            this.lastResult = eval(args.join(' '));
            hrDiff = process.hrtime(hrStart);
        } catch (err) {
            return message.reply(`Error while evaluating: \`${err}\``);
        }

        this.hrStart = process.hrtime();
        const result = this.makeResultMessages(this.lastResult, hrDiff, args.join(' '));
        if (Array.isArray(result)) {
            return result.map(item => message.reply(item));
        } else {
            return message.reply(result);
        }
    }

    makeResultMessages(result, hrDiff, input = null) {
        const inspected = util.inspect(result, {depth: 0}).replace(nlPattern, '\n').replace(this.sensitivePattern, '--snip--');
        const split = inspected.split('\n');
        const last = inspected.length - 1;
        const prependPart = inspected[0] !== '{' && inspected[0] !== '[' && inspected[0] !== "'" ? split[0] : inspected[0];
        const appendPart = inspected[last] !== '}' && inspected[last] !== ']' && inspected[last] !== "'" ?
            split[split.length - 1] : inspected[last];
        const prepend = `\`\`\`javascript\n${prependPart}\n`;
        const append = `\n${appendPart}\n\`\`\``;
        if (input) {
            return Discord.splitMessage(tags.stripIndents`
				*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*
				\`\`\`javascript
				${inspected}
				\`\`\`
			`, {maxLength: 1900, prepend, append});
        } else {
            return Discord.splitMessage(tags.stripIndents`
				*Callback executed after ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*
				\`\`\`javascript
				${inspected}
				\`\`\`
			`, {maxLength: 1900, prepend, append});
        }
    }

    get sensitivePattern() {
        if (!this._sensitivePattern) {
            const client = this.client;
            let pattern = '';
            if (client.token) pattern += escapeRegex(client.token);
            Object.defineProperty(this, '_sensitivePattern', {value: new RegExp(pattern, 'gi')});
        }
        return this._sensitivePattern;
    }
}

module.exports = Eval;