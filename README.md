# Installation

1. Run `git clone https://github.com/Stef-00012/Discord-User-Installed-Apps`.
2. Fill the environment variables in the compose file (See [#Config](https://github.com/Stef-00012/Discord-User-Installed-Apps/#config)).
3. Run `docker compose up -d`.

# Config

- `BOT_TOKEN`: Your Discord bot token.
- `OWNERS`: An list of Discord users allowed to use owner-only commands (split by `,`). Example: `123,456,789`.
- `PUBLIC`: Whetever the bot is public, if so, when the web is enabled, a `/invite` route is created that redirects to the bot's invite.

- `ZIPLINE_TOKEN`: Your Zipline token. [^1]
- `ZIPLINE_URL`: Your Zipline hostname. [^1]
- `ZIPLINE_CHUNK_SIZE`: File chunk size, for chunked uploads (in mb). [^1]
- `ZIPLINE_MAX_FILE_SIZE`: Max file size (in mb). [^1]

- `NAVIAC_USERNAME`: Username for the N.A.V.I.A.C. API authentication. [^2]
- `NAVIAC_TOKEN`: Token for the N.A.V.I.A.C. API authentication. [^2]

- `DASHBOARD_ENABLED`:  Whetever the web dashboard is enabled.
- `DASHBOARD_HOSTNAME`: Your web dashboard hostname.
- `DASHBOARD_SECURE`: Whetever the dashboard uses `http` or `https`.
- `DASHBOARD_URL_KEEP_PORT`: whetever in the commands it should keep the port or remove it (eg. if you use a reverse proxy or port `443`/`80`).

- `DISCORD_CLIENT_ID`: Your Discord bot client ID.
- `DISCORD_CLIENT_SECRET`: Your Discord bot client secret.
- `DISCORD_REDIRECT_URI`: Your OAuth2 redirect URI.

- `JWT_SECRET`: Your JSON Web Token secret (any string, possibly hard to guess).

- `DISCORD_WEBHOOK_ENABLED`: Whetever you want to use discord webhook events (currently only application authorized event is supported), required web dashboard. When enabled it starts listening on `/discord/webhook`.
- `DISCORD_WEBHOOK_PUBLIC_KEY`: The public key from you developer portal application.
- `DISCORD_WEBHOOK_NOTIFICATION_URLS`: Urls where to send the notifications when an event is triggered (split by `,`). Must be an [AppRise Compatible URL](https://github.com/caronc/apprise#productivity-based-notifications).
- `DISCORD_WEBHOOK_MESSAGE_TITLE`: Notification title when someone authorizes your bot. [^3]
- `DISCORD_WEBHOOK_MESSAGE_BODY`: Notification body when someone authorizes your bot. [^3]


[^1]: Zipline is https://zipline.diced.sh.
[^2]: N.A.V.I.A.C. is an AI.
[^3]: Message title and body support those templates:<br />- `{{user}}`: Username of the user who authorized.<br />- `{{user.id}}`: ID of the user who authorized.<br />- `{{bot}}`: Bot username.<br />- `{{time}}`: Day and hour when the event happened.

# Hosted

If you can not selfhost the bot, you can use the already hosted versions.

- By [Stef-00012](https://github.com/Stef-00012) (me) - [here](https://discord.com/oauth2/authorize?client_id=1223221223685886032).
- By [CreeperITA104](https://github.com/Creeperita09) - [here](https://discord.com/oauth2/authorize?client_id=1222184630581592107).
- By [Ninja-5000](https://github.com/Ninja-5000) - [here](https://discord.com/oauth2/authorize?client_id=1042885313367900211).

# Credits

- Code: [Stef-00012](https://github.com/Stef-00012).
- Dashboard Frontend: [Ninja-5000](https://github.com/Ninja-5000).