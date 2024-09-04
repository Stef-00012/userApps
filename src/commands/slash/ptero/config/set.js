module.exports = async (client, int) => {
    let panelUrl = int.options.getString('url')
    const apiKey = int.options.getString('key')

    if (!panelUrl.startsWith('http://') && !panelUrl.startsWith('https://')) return int.reply({
        content: "The provided panel URL is invalid",
        ephemeral: true
    })

    panelUrl = panelUrl.split('/').slice(0, 3).join('/')


    if (!apiKey.startsWith('ptlc_')) return int.reply({
        content: "Invalid API key",
        ephemeral: true
    })

    await int.deferReply({
        ephemeral: true
    })

    const userPteroData = {
        panelUrl,
        apiKey

    }

    const pteroSchema = client.dbSchema.ptero

    await client.db
        .insert(pteroSchema)
        .values({
            id: int.user.id,
            ...userPteroData
        })
        .onConflictDoUpdate({
            target: pteroSchema.id,
            set: userPteroData
        })

    int.editReply({
        content: "Successfully saved your pterodactyl config"
    })
}