import config from "$config";
import {
	ApplicationCommandType,
	ApplicationCommandOptionType,
	type APIApplicationCommand,
	type ApplicationCommandOption,
} from "discord.js";

const uploadV3Options: Array<ApplicationCommandOption> = [
	{
		name: "zero-width-spaces",
		type: ApplicationCommandOptionType.Boolean,
		description: "Whether to add zero width spaces to the URL",
		required: false
	},
	{
		name: "embed",
		type: ApplicationCommandOptionType.Boolean,
		description: "Whether to embed the file",
		required: false
	}
]

const uploadV4Options: Array<ApplicationCommandOption> = [
	{
		name: "folder",
		type: ApplicationCommandOptionType.String,
		autocomplete: true,
		description: "The folder to upload the file to",
		required: false
	},
]

const uploadOptions = config.zipline?.version === "v3"
	? uploadV3Options
	: uploadV4Options;

const shortenV4Options: Array<ApplicationCommandOption> = [
	{
		name: "max-views",
		description: "The maximum views of the URL",
		type: ApplicationCommandOptionType.Integer,
		required: false
	},
	{
		name: "password",
		description: "Password for the URL",
		type: ApplicationCommandOptionType.String,
		required: false
	}
]

const shortenOptions = config.zipline?.version === "v3"
? []
: shortenV4Options;

export default [
	// slash commands
	{
		name: "eval",
		description: "Executes the given code",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "code",
				type: ApplicationCommandOptionType.String,
				description: "The code to execute",
				required: true,
			},
			{
				name: "personal",
				type: ApplicationCommandOptionType.Boolean,
				description: "If hide the output or not",
				required: false,
			},
		],
	},
	{
		name: "tag",
		description: "Save or some premade messages",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "content",
				description: "Set or replace the content of a tag",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "name",
						description: "The name of the tag",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
					{
						name: "content",
						description: "The content of the tag",
						type: ApplicationCommandOptionType.String,
						required: false,
					},
					{
						name: "remove",
						description: "Whether remove the content of the tag",
						type: ApplicationCommandOptionType.Boolean,
						required: false,
						max_length: 2000,
					},
				],
			},
			{
				name: "delete",
				description: "Delete a tag",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "name",
						description: "The name of the tag",
						type: ApplicationCommandOptionType.String,
						required: true,
						autocomplete: true,
					},
				],
			},
			{
				name: "get",
				description: "Get a tag",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "name",
						description: "The name of the tag",
						type: ApplicationCommandOptionType.String,
						required: true,
						autocomplete: true,
					},
					{
						name: "ephemeral",
						description: "If the message should be ephemeral",
						type: ApplicationCommandOptionType.Boolean,
						required: false,
					},
				],
			},
			{
				name: "list",
				description: "List your tags",
				type: ApplicationCommandOptionType.Subcommand,
			},
			{
				name: "embed",
				description: "Add or remove an embed from a tag",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "name",
						description: "The name of the tag",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
					{
						name: "remove-index",
						description: "The index of the embed to remove",
						type: ApplicationCommandOptionType.Integer,
						required: false,
					},
					{
						name: "title",
						type: ApplicationCommandOptionType.String,
						description: "Embed title",
						required: false,
						max_length: 256,
					},
					{
						name: "description",
						type: ApplicationCommandOptionType.String,
						description: "Embed description",
						required: false,
						max_length: 4096,
					},
					{
						name: "url",
						type: ApplicationCommandOptionType.String,
						description: "Embed URL",
						required: false,
					},
					{
						name: "timestamp",
						type: ApplicationCommandOptionType.Boolean,
						description: "Embed timestamp",
						required: false,
					},
					{
						name: "color",
						type: ApplicationCommandOptionType.String,
						description: "Embed color",
						required: false,
						max_length: 4096,
					},
					{
						name: "footer-text",
						type: ApplicationCommandOptionType.String,
						description: "Embed footer text",
						required: false,
						max_length: 2048,
					},
					{
						name: "footer-icon",
						type: ApplicationCommandOptionType.String,
						description: "Embed footer icon",
						required: false,
					},
					{
						name: "image",
						type: ApplicationCommandOptionType.String,
						description: "Embed image",
						required: false,
					},
					{
						name: "thumbnail",
						type: ApplicationCommandOptionType.String,
						description: "Embed thumbnail",
						required: false,
						max_length: 4096,
					},
					{
						name: "author-name",
						type: ApplicationCommandOptionType.String,
						description: "Embed author name",
						required: false,
						max_length: 256,
					},
					{
						name: "author-icon",
						type: ApplicationCommandOptionType.String,
						description: "Embed author icon",
						required: false,
					},
					{
						name: "fields",
						type: ApplicationCommandOptionType.Boolean,
						description: "Embed fields",
						required: false,
					},
					{
						name: "json",
						type: ApplicationCommandOptionType.String,
						description: "Embed json",
						required: false,
					},
				],
			},
			{
				name: "export",
				description: "Export your tags",
				type: ApplicationCommandOptionType.Subcommand,
			},
			{
				name: "import",
				description: "tags",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "file",
						description: "The JSON file with your tags",
						type: ApplicationCommandOptionType.Attachment,
						required: true,
					},
					{
						name: "overwrite",
						description:
							"If overwrite your old tags or add on top of existing ones",
						type: ApplicationCommandOptionType.Boolean,
						required: false,
					},
				],
			},
		],
	},
	{
		name: "perms",
		description: "changes the permissions for a command (who can use it)",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "add",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Add an user to the allowed users",
				options: [
					{
						name: "command",
						description:
							"The command whose you want to change the allowed users",
						type: ApplicationCommandOptionType.String,
						autocomplete: true,
						required: true,
					},
					{
						name: "user",
						description:
							"The user whose you want to change the permissions for that command (id)",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
				],
			},
			{
				name: "remove",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Remove an user from the allowed users",
				options: [
					{
						name: "command",
						description:
							"The command whose you want to change the allowed users",
						type: ApplicationCommandOptionType.String,
						autocomplete: true,
						required: true,
					},
					{
						name: "user",
						description:
							"The user whose you want to change the permissions for that command (id)",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
				],
			},
			{
				name: "list",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Lists the permissions for each command",
			},
		],
	},
	{
		name: "embed",
		description: "Sends an embed with the given data",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "title",
				type: ApplicationCommandOptionType.String,
				description: "Embed title",
				required: false,
				max_length: 256,
			},
			{
				name: "description",
				type: ApplicationCommandOptionType.String,
				description: "Embed description",
				required: false,
				max_length: 4096,
			},
			{
				name: "url",
				type: ApplicationCommandOptionType.String,
				description: "Embed URL",
				required: false,
			},
			{
				name: "timestamp",
				type: ApplicationCommandOptionType.Boolean,
				description: "Embed timestamp",
				required: false,
			},
			{
				name: "color",
				type: ApplicationCommandOptionType.String,
				description: "Embed color",
				required: false,
				max_length: 4096,
			},
			{
				name: "footer-text",
				type: ApplicationCommandOptionType.String,
				description: "Embed footer text",
				required: false,
				max_length: 2048,
			},
			{
				name: "footer-icon",
				type: ApplicationCommandOptionType.String,
				description: "Embed footer icon",
				required: false,
			},
			{
				name: "image",
				type: ApplicationCommandOptionType.String,
				description: "Embed image",
				required: false,
			},
			{
				name: "thumbnail",
				type: ApplicationCommandOptionType.String,
				description: "Embed thumbnail",
				required: false,
				max_length: 4096,
			},
			{
				name: "author-name",
				type: ApplicationCommandOptionType.String,
				description: "Embed author name",
				required: false,
				max_length: 256,
			},
			{
				name: "author-icon",
				type: ApplicationCommandOptionType.String,
				description: "Embed author icon",
				required: false,
			},
			{
				name: "fields",
				type: ApplicationCommandOptionType.Boolean,
				description: "Embed fields",
				required: false,
			},
			{
				name: "json",
				type: ApplicationCommandOptionType.String,
				description: "Embed json",
				required: false,
			},
		],
	},
	{
		name: "status",
		description: "Changes the enabled status of a command",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "enable",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Enables a command",
				options: [
					{
						name: "command",
						description: "The command to enable",
						type: ApplicationCommandOptionType.String,
						autocomplete: true,
						required: true,
					},
				],
			},
			{
				name: "disable",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Disables a command",
				options: [
					{
						name: "command",
						description: "The command to disable",
						type: ApplicationCommandOptionType.String,
						autocomplete: true,
						required: true,
					},
				],
			},
		],
	},
	{
		name: "qr",
		description: "Create a QR code",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "text",
				type: ApplicationCommandOptionType.String,
				description: "The text to convert to a QR code",
				required: true,
				max_length: 900,
			},
			{
				name: "type",
				type: ApplicationCommandOptionType.String,
				description: "QR code type",
				required: false,
				choices: [
					{
						name: "Text",
						value: "text",
					},
					{
						name: "Image",
						value: "image",
					},
				],
			},
		],
	},
	{
		name: "minecraft",
		description: "Get the data of a minecarft server or a player's skin",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "server",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Get data about a minecraft server",
				options: [
					{
						name: "version",
						description: "The server version",
						type: ApplicationCommandOptionType.String,
						choices: [
							{
								name: "Java",
								value: "java",
							},
							{
								name: "Bedrock",
								value: "bedrock",
							},
						],
						required: true,
					},
					{
						name: "address",
						description: "The server address",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
				],
			},
			{
				name: "skin",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Get the skin of a player",
				options: [
					{
						name: "render-type",
						description: "How to render the player skin",
						type: ApplicationCommandOptionType.String,
						autocomplete: true,
						required: true,
					},
					{
						name: "crop-type",
						description: "How to crop the rendered player skin",
						type: ApplicationCommandOptionType.String,
						autocomplete: true,
						required: true,
					},
					{
						name: "player",
						description: "he player name or UUID (prefix with . for Bedrock)",
						type: ApplicationCommandOptionType.String,
						required: false,
					},
					{
						name: "skin-url",
						description: "The URL to a minecraft skin",
						type: ApplicationCommandOptionType.String,
						required: false,
					},
					{
						name: "skin-type",
						description: "The player skin type (default: wide)",
						type: ApplicationCommandOptionType.String,
						choices: [
							{
								name: "Slim",
								value: "slim",
							},
							{
								name: "Wide",
								value: "wide",
							},
						],
						required: false,
					},
				],
			},
			{
				name: "user",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Get info about a player",
				options: [
					{
						name: "player",
						description: "he player name or UUID (prefix with . for Bedrock)",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
				],
			},
		],
	},
	{
		name: "8ball",
		description: "Ask a question to the 8ball",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "question",
				type: ApplicationCommandOptionType.String,
				description: "The question to ask",
				required: true,
				max_length: 1900,
			},
		],
	},
	{
		name: "upload",
		description: "Upload a file to your zipline server",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "file",
				type: ApplicationCommandOptionType.Attachment,
				description: "The file to upload",
				required: false,
			},
			{
				name: "text",
				type: ApplicationCommandOptionType.String,
				description: "The text to upload",
				required: false,
			},
			{
				name: "filename",
				description: "Override the filename of the file",
				type: ApplicationCommandOptionType.String,
				max_length: 50,
				required: false,
			},
			{
				name: "password",
				type: ApplicationCommandOptionType.String,
				description: "Password for the file",
				required: false,
			},
			{
				name: "override-domain",
				type: ApplicationCommandOptionType.String,
				description: "The domain to use for the URL",
				required: false
			},
			{
				name: "original-name",
				type: ApplicationCommandOptionType.Boolean,
				description: "Whether keep the original name",
				required: false
			},
			{
				name: "expiration",
				type: ApplicationCommandOptionType.String,
				description: "The expiration time of the file",
				autocomplete: true,
				required: false,
			},
			{
				name: "max-views",
				type: ApplicationCommandOptionType.Integer,
				description: "The maximum views of the file",
				required: false,
			},
			{
				name: "compression",
				type: ApplicationCommandOptionType.Integer,
				description: "The percentage of compression of the file",
				required: false
			},
			{
				name: "format",
				type: ApplicationCommandOptionType.String,
				description: "URL ID format",
				required: false,
				choices: [
					{
						name: "UUID",
						value: "uuid"
					},
					{
						name: "Date",
						value: "date"
					},
					{
						name: "Random",
						value: "random"
					},
					{
						name: "Name",
						value: "name"
					},
					{
						name: "Gfycat",
						value: "gfycat"
					}
				]
			},
			...uploadOptions,
			{
				name: "chunked",
				description: "Wether to upload the file in chunks",
				type: ApplicationCommandOptionType.Boolean,
				required: false,
			},
			{
				name: "ephemeral",
				description: "Wether send an ephemeral reponse",
				type: ApplicationCommandOptionType.Boolean,
				required: false,
			},
		],
	},
	{
		name: "shorten",
		description: "Shorten a URL with zipline",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "url",
				type: ApplicationCommandOptionType.String,
				description: "The URL to shorten",
				required: true,
			},
			{
				name: "vanity",
				type: ApplicationCommandOptionType.String,
				description: "Custom vanity URL",
				required: false,
			},
			...shortenOptions,
			{
				name: "ephemeral",
				description: "Wether send an ephemeral reponse",
				type: ApplicationCommandOptionType.Boolean,
				required: false,
			},
		],
	},
	{
		name: "ask",
		description: "Ask a question to N.A.V.I.A.C.",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "question",
				type: ApplicationCommandOptionType.String,
				description: "The question to ask",
				required: true,
			},
			{
				name: "personal",
				type: ApplicationCommandOptionType.Boolean,
				description: "If hide the output or not",
				required: false,
			},
		],
	},
	{
		name: "http",
		description: "Get a HTTP status code",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "type",
				type: ApplicationCommandOptionType.String,
				description: "HTTP status code type",
				required: true,
				choices: [
					{
						name: "Cat",
						value: "cat",
					},
					{
						name: "Dog",
						value: "dog",
					},
					{
						name: "Goat",
						value: "goat",
					},
				],
			},
			{
				name: "status",
				type: ApplicationCommandOptionType.Integer,
				description: "The HTTP status code",
				required: true,
			},
		],
	},
	{
		name: "dig",
		description: "Dig a domain",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "domain",
				type: ApplicationCommandOptionType.String,
				description: "Domain to dig",
				required: true,
			},
			{
				name: "record",
				type: ApplicationCommandOptionType.String,
				description: "Record type to dig",
				required: false,
				autocomplete: true,
			},
			{
				name: "short",
				type: ApplicationCommandOptionType.Boolean,
				description: "Whether have a short output",
				required: false,
			},
			{
				name: "provider",
				type: ApplicationCommandOptionType.String,
				description: "DNS provider to use",
				required: false,
				choices: [
					{
						name: "1.1.1.1 (Cloudflare)",
						value: "1.1.1.1",
					},
					{
						name: "1.1.1.2 (Cloudflare Malware Blocking)",
						value: "1.1.1.2",
					},
					{
						name: "1.1.1.3 (Cloudflare Malware Blocking + Adult Content Blocking)",
						value: "1.1.1.3",
					},
					{
						name: "8.8.8.8 (Google)",
						value: "8.8.8.8",
					},
					{
						name: "9.9.9.9 (Quad9)",
						value: "9.9.9.9",
					},
				],
			},
			{
				name: "cdflag",
				type: ApplicationCommandOptionType.Boolean,
				description: "Whether use the cdflag",
				required: false,
			},
		],
	},
	{
		name: "console",
		description: "Executes the given command",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "command",
				type: ApplicationCommandOptionType.String,
				description: "The command to execute",
				required: true,
			},
			{
				name: "personal",
				type: ApplicationCommandOptionType.Boolean,
				description: "If hide the output or not",
				required: false,
			},
		],
	},
	{
		name: "animal",
		description: "Get an animap pic",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "type",
				type: ApplicationCommandOptionType.String,
				description: "The animal type to get",
				required: false,
				choices: [
					{
						name: "Cat",
						value: "cat",
					},
					{
						name: "Dog",
						value: "dog",
					},
					{
						name: "Fox",
						value: "fox",
					},
					{
						name: "Duck",
						value: "duck",
					},
				],
			},
		],
	},
	{
		name: "define",
		description: "Define a term",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "term",
				type: ApplicationCommandOptionType.String,
				description: "The term to define",
				required: true,
			},
		],
	},
	{
		name: "export",
		description: "Export a file",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "path",
				type: ApplicationCommandOptionType.String,
				description: "The file to export",
				required: true,
			},
		],
	},
	{
		name: "reminders",
		description: "Add or remove a reminder",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "add",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Add a reminder",
				options: [
					{
						name: "time",
						description: "In how long the reminder will be sent",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
					{
						name: "reason",
						description: "What you want to be reminded of",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
					{
						name: "repeat",
						description: "How many times repwat the reminder, 0 = unlimited",
						type: ApplicationCommandOptionType.Integer,
						required: false
					}
				],
			},
			{
				name: "remove",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Remove an user from the allowed users",
				options: [
					{
						name: "id",
						description: "The id of the reminder",
						type: ApplicationCommandOptionType.String,
						autocomplete: true,
						required: true,
					},
				],
			},
			{
				name: "list",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Lists your reminders",
			},
		],
	},
	{
		name: "ptero",
		description: "Manage your pterodactyl servers",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "server",
				description: "Manage your pterodactyl servers",
				type: ApplicationCommandOptionType.SubcommandGroup,
				options: [
					{
						name: "info",
						description: "Get the informations about a pterodactyl server",
						type: ApplicationCommandOptionType.Subcommand,
						options: [
							{
								name: "id",
								description: "The pterodactyl server ID",
								type: ApplicationCommandOptionType.String,
								required: true,
							},
						],
					},
					{
						name: "power",
						description: "Run a power action on your server",
						type: ApplicationCommandOptionType.Subcommand,
						options: [
							{
								name: "id",
								description: "The pterodactyl server ID",
								type: ApplicationCommandOptionType.String,
								required: true,
							},
							{
								name: "action",
								description: "The power action",
								type: ApplicationCommandOptionType.String,
								required: true,
								choices: [
									{
										name: "Start",
										value: "start",
									},
									{
										name: "Stop",
										value: "stop",
									},
									{
										name: "Restart",
										value: "restart",
									},
									{
										name: "Kill",
										value: "kill",
									},
								],
							},
						],
					},
					{
						name: "command",
						description: "Run a command on your server",
						type: ApplicationCommandOptionType.Subcommand,
						options: [
							{
								name: "id",
								description: "The pterodactyl server ID",
								type: ApplicationCommandOptionType.String,
								required: true,
							},
							{
								name: "command",
								description: "The command",
								type: ApplicationCommandOptionType.String,
								required: true,
							},
						],
					},
					{
						name: "list",
						description: "List all your pterodactyl servers",
						type: ApplicationCommandOptionType.Subcommand,
					},
				],
			},
			{
				name: "account",
				description: "Manage your pterodactyl account",
				type: ApplicationCommandOptionType.SubcommandGroup,
				options: [
					{
						name: "info",
						description: "Get the informations about your pterodactyl account",
						type: ApplicationCommandOptionType.Subcommand,
						options: [
							{
								name: "mail",
								description: "Whetever show the mail or not",
								type: ApplicationCommandOptionType.Boolean,
								required: false,
							},
						],
					},
				],
			},
			{
				name: "config",
				description: "Manage your pterodactyl bot config",
				type: ApplicationCommandOptionType.SubcommandGroup,
				options: [
					{
						name: "set",
						description: "set your panel URL and API key",
						type: ApplicationCommandOptionType.Subcommand,
						options: [
							{
								name: "url",
								description: "Your panel URL",
								type: ApplicationCommandOptionType.String,
								required: true,
							},
							{
								name: "key",
								description: "Your API key",
								type: ApplicationCommandOptionType.String,
								required: true,
							},
						],
					},
				],
			},
		],
	},
	{
		name: "ping",
		description: "Get the bot's ping",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
	},
	{
		name: "colorpicker",
		description: "View a color from a hex",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "hex",
				type: ApplicationCommandOptionType.String,
				description: "The hex value",
				required: true,
			},
		],
	},
	{
		name: "gary",
		description: "Get Gary's pictures and quotes",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "image",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Get an image of Gary",
			},
			{
				name: "quote",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Get a quote of Gary",
			},
			{
				name: "joke",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Get a joke of Gary",
			},
			{
				name: "goober",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Get an image of Goober",
			},
		],
	},
	{
		name: "whois",
		description: "Perform a WHOIS query",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "query",
				type: ApplicationCommandOptionType.String,
				description: "The domain to query",
				required: true,
			},
		],
	},
	{
		name: "ip",
		description: "Get the informations about the given IP address",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
		options: [
			{
				name: "ip",
				type: ApplicationCommandOptionType.String,
				description: "The IP address to query",
				required: true,
			},
		],
	},
	{
		name: "topic",
		description: "Get a random topic",
		type: ApplicationCommandType.ChatInput,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
	},

	// message commands
	{
		name: "Save as Tag",
		type: ApplicationCommandType.Message,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
	},
	{
		name: "Get Message JSON",
		type: ApplicationCommandType.Message,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
	},
	{
		name: "Convert to QR Code",
		type: ApplicationCommandType.Message,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
	},
	{
		name: "Set as Reminder",
		type: ApplicationCommandType.Message,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
	},
	{
		name: "Download Voice Message",
		type: ApplicationCommandType.Message,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
	},

	// user commands
	{
		name: "Get User JSON",
		type: ApplicationCommandType.User,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
	},
	{
		name: "Get Member JSON",
		type: ApplicationCommandType.User,
		integration_types: [0, 1],
		contexts: [0],
	},
	{
		name: "Get User Avatar",
		type: ApplicationCommandType.User,
		integration_types: [0, 1],
		contexts: [0, 1, 2],
	},
	{
		name: "Get Member Avatar",
		type: ApplicationCommandType.User,
		integration_types: [0, 1],
		contexts: [0],
	},
] as Array<APIApplicationCommand>;
