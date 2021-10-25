const Util = require('fallout-utility');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = new create();

function create(){
    let language = {};
    this.versions = ['1.1.0'];
    this.command = {
        username: {
            required: true
        },
        reason: {
            required: false
        }
    };

    this.start = (client, action, conf, lang) => {
        language = lang;
        return true;
    }
    this.execute = async (args, message, client, action) => {
        if(!args.length) { action.messageReply(message, action.get(language.empty)); return; }
        if(!message.mentions.members.first() || message.mentions.members.first() == null) { action.messageReply(message, action.get(language.needPing)); return; }

        const target = message.mentions.members.first();
        let reason = Util.makeSentence(args, 1).toString().trim();

        if(reason.length == 0) reason = action.get(language.kicked.defaultReason);
        if(target.user.id == message.author.id) { action.messageReply(message, action.get(language.noPerms)); return; }
        
        const Kick = await kick(target, reason);
        if(!Kick) return;

        reason = Util.replaceAll(reason, '%username%', target.user.username);
        reason = Util.replaceAll(reason, '%author%', message.author.username);

        let embed = new MessageEmbed()
            .setTitle(action.get(language.kicked.title))
            .setDescription(reason)
            .setTimestamp();
        
        await action.messageReply(message, { embeds: [embed]});
    }
    this.slash = {
        command: new SlashCommandBuilder()
            .setName("kick")
            .setDescription("Kick user")
            .addUserOption(user => user.setName("user")
                .setDescription("User to kick")
                .setRequired(true)
            )
            .addStringOption(reason => reason.setName("reason")
                .setDescription("Reason for kick")
                .setRequired(false)
            ),
        async execute(interaction, client, action) {
            const target = interaction.options.getUser('user');
            let reason = action.get(language.kicked.defaultReason);

            if(!interaction.guild.members.cache.get(target.id)) { await action.interactionReply(interaction, { content: action.get(language.notAvailable), ephemeral: true}); return; }
            if(target.id == interaction.member.user.id) { action.interactionReply(interaction, { content: action.get(language.noPerms), ephemer: true}); return; }

            if(interaction.options.getString('reason')) reason = interaction.options.getString('reason');

            const Kick = await kick(interaction.guild.members.cache.get(target.id), reason);
            if(!Kick) return;

            await action.interactionDeferReply(interaction);
            reason = Util.replaceAll(reason, '%username%', target.username);
            reason = Util.replaceAll(reason, '%author%', interaction.member.user.username);

            let embed = new MessageEmbed()
                .setTitle(action.get(language.kicked.title))
                .setDescription(reason)
                .setTimestamp();
            
            await action.interactionEditReply(interaction, { embeds: [embed] });
        }
    }

    async function kick(user, reason) {
        try {
            return await user.kick(reason).catch( err => console.error(err));
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}