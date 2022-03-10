
//Package Imports
const Discord = require('discord.js');
const ytdl = require("ytdl-core");
const chalk = require('chalk');
const { createAudioPlayer, joinVoiceChannel, createAudioResource } = require('@discordjs/voice');

const client = new Discord.Client({
    disableEveryone: true,
    presence: {
        status: 'idle',
        afk: true,
        activities: [{
            name: process.env.CUSTOMSTATUS,
            type: 'LISTENING',
        }],
    },
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES']
});

//Create the client
client.on("ready", async () => {
    //Log the client's status
    console.log(chalk.blue(`[INFO] ${chalk.red(`Logged in - ${client.user.tag}`)}`))
    
    joinChannel("942492536130383952");
    await new Promise(res => setTimeout(() => res(2), 500))
    
    //JoinChannel Function
    function joinChannel(channelId) {
        client.channels.fetch(channelId).then(channel => {
            console.log(chalk.blue(`[INFO] ${chalk.red(`Joining Voice Channel - ${channel.id}`)}`))
            const VoiceConnection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator
            });
            const resource = createAudioResource(ytdl(`https://www.youtube.com/watch?v=${"gtRhZvlYfpg"}`), {
                inlineVolume: true
            });
            resource.volume.setVolume(1);
            const player = createAudioPlayer()
            VoiceConnection.subscribe(player);
            console.log(chalk.green(`\n[MUSIC] ${chalk.red(`Now Playing - https://www.youtube.com/watch?v=${"gtRhZvlYfpg"}`)}`))
            console.log(chalk.green(`[EVENT] ${chalk.red(`Sending Ready Event To Pterodactyl`)}`));
            console.log('done')
            player.play(resource);
            player.on("idle", () => {
                try {
                    console.log(chalk.green(`\n[MUSIC] ${chalk.red(`Stopped Playing and left Voice Channel`)}`))
                    player.stop()
                } catch (e) { }
                try {
                    VoiceConnection.destroy()
                } catch (e) {
                    console.log(`${chalk.red(`[ERROR]`)} ${e}`)
                }
                joinChannel(channel.id)
            })
        }).catch(console.error)
    }
})

//Log into the client
client.login(process.env.TOKEN);
