import type { ChatInputCommandInteraction } from "discord.js";
import type { Client } from "&/DiscordClient";
import type { Command } from "?/command";
import crypto from "node:crypto";

export default {
	name: "8ball",
	requires: [],

	async execute(_client: Client, int: ChatInputCommandInteraction) {
		const question = int.options.getString("question", true);

		const categories = {
			positive: [
				"It is certain.",
				"It is decidedly so.",
				"Without a doubt.",
				"Yes, definitely.",
				"You may rely on it.",
				"As I see it, yes.",
				"Most likely.",
				"Outlook good.",
				"Signs point to yes.",
				"Yes.",
				"Absolutely.",
				"Almost certainly.",
				"Definitely.",
				"For sure.",
				"Hell yes.",
				"I think so.",
				"Indeed.",
				"It's a certainty.",
				"It's highly likely.",
				"It's likely.",
				"It's possible.",
				"It's probable.",
				"It's very likely.",
				"No doubt.",
			],
			neutral: [
				"Reply hazy, try again.",
				"Ask again later.",
				"Better not tell you now.",
				"Cannot predict now.",
				"Concentrate and ask again.",
				"Unclear at the moment.",
				"It’s too soon to tell.",
				"The universe is undecided.",
				"Let fate decide.",
				"Hard to say right now.",
				"Try again later.",
				"It could go either way.",
				"Not sure, ask again.",
				"Perhaps.",
				"It’s a mystery.",
			],
			negative: [
				"Don't bet on it.",
				"My reply is no.",
				"My sources say no.",
				"Outlook not so good.",
				"Very doubtful.",
				"No way.",
				"Never.",
				"Nope.",
				"Not a chance.",
				"Not in a million years.",
				"Not likely.",
				"Under no circumstances.",
				"Absolutely not.",
				"Doubtful.",
				"The answer is no.",
				"No signs point to yes.",
				"Don’t count on it.",
				"The odds are not in your favor.",
				"I wouldn’t bet on it.",
				"Highly unlikely.",
				"Impossible.",
			],
		};

		const categoryNames = Object.keys(categories);
		const randomCategory =
			categories[
				categoryNames[
					crypto.randomInt(0, categoryNames.length)
				] as keyof typeof categories
			];

		const answer = randomCategory[crypto.randomInt(0, randomCategory.length)];

		await int.reply({
			content: `> ${question}\n${answer}`,
		});
	},
} as Command;
