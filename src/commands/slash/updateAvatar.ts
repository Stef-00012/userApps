import type { Client } from "../../structures/DiscordClient";
import type { Command } from "../../types/command";
import config from "$config";
import {
    MessageFlags,
	type ChatInputCommandInteraction,
} from "discord.js";

export default {
	name: "setavatar",
	requires: [],

	async execute(client: Client, int: ChatInputCommandInteraction) {
		let avatar = int.options.getString("avatar");

        await int.deferReply({
            flags: MessageFlags.Ephemeral
        })
		
        if (!avatar) {
            const ownerId =
                typeof config.autoUpdateAvatar === "string"
                    ? config.autoUpdateAvatar
                    : config.owners[0];

            try {
                const avatarOwner = await client.users.fetch(ownerId)

                avatar = avatarOwner.displayAvatarURL()
            } catch(e) {
                return int.editReply({
                    content: "Failed to fetch avatar from owner and no avatar was provided",
                })
            }
        }

        try {
            await client.user?.setAvatar(avatar)

            await int.editReply({
                content: `Successfully updated the avatar to ${avatar}`, 
            })
        } catch(e) {
            console.error(e)

            return int.editReply({
                content: "Something went wrong while updating the avatar",
            })
        }
	},
} as Command;
