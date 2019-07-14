/** @typedef { import('discord.js').Guild } Guild */
/** @typedef { import('discord.js').TextChannel } TextChannel */

const Discord = require('discord.js')
const client = new Discord.Client()

const GYM_MEMBERSHIP = 'gym-membership'
const WELCOME_MESSAGE = 'Hi Trainers! Candela here.'

client.on('ready', () => {
  client.guilds.tap(guild => initGuild(guild))
  console.log('Ready.')
})

client.on('guildCreate', guild => {
  initGuild(guild)
})

/**
 * @param {Guild} guild
 */
async function initGuild (guild) {
  const gymMembershipChannel = await getOrCreateGymMembershipChannel(guild)
  // Fetching messages has the important side effect of caching old gym messages.
  const messages = await gymMembershipChannel.fetchMessages()
  const candelaMessages = messages.filter(message => message.author.id === client.user.id)
  if (candelaMessages.size === 0) {
    gymMembershipChannel.send(WELCOME_MESSAGE)
  }
}

/**
 * @param {Guild} guild
 * @returns {TextChannel}
 */
async function getOrCreateGymMembershipChannel (guild) {
  const channel = guild.channels.find(channel => channel.name === GYM_MEMBERSHIP)
  if (channel) {
    return channel
  } else {
    const botOnlyPermissions = ['SEND_MESSAGES', 'ADD_REACTIONS']
    return guild.createChannel(GYM_MEMBERSHIP, {
      permissionOverwrites: [
        { id: guild.id, deny: botOnlyPermissions },
        { id: client.user.id, allow: botOnlyPermissions }
      ]
    })
  }
}

client.login(process.env.TOKEN)
