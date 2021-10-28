const { makeSentence, replaceAll } = require('fallout-utility');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const safeMessage = require('../scripts/safeMessage');

module.exports = new create();

function create(){
    let language = {};
    this.versions = ['1.1.0'];
    this.arguments = {
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
        if(!args.length) {
            await safeMessage.reply(message, action.get(language.empty));
            return;
        }
        if(!message.mentions.members.first() || message.mentions.members.first() == null) {
            await safeMessage.reply(message, action.get(language.needPing));
            return;
        }

        const target = message.mentions.members.first();
        let reason = makeSentence(args, 1).toString().trim();

        if(reason.length == 0) { reason = action.get(language.banned.defaultReason); }
        if(target.user.id == message.author.id) {
            await safeMessage.reply(message, action.get(language.noPerms));
            return;
        }
        
        const Ban = await ban(target, reason);
        if(!Ban) return;

        reason = replaceAll(reason, '%username%', target.user.username);
        reason = replaceAll(reason, '%author%', message.author.username);

        let embed = new MessageEmbed()
            .setTitle(action.get(language.banned.title))
            .setDescription(reason)
            .setTimestamp();
        
        await safeMessage.reply(message, { embeds: [embed]});
    }
    this.slash = {
        command: new SlashCommandBuilder()
            .setName("ban")
            .setDescription("Ban user")
            .addUserOption(user => user.setName("user")
                .setDescription("User to ban")
                .setRequired(true)
            )
            .addStringOption(reason => reason.setName("reason")
                .setDescription("Reason for ban")
                .setRequired(false)
            ),
        async execute(interaction, client, action) {
            const target = interaction.options.getUser('user');
            let reason = action.get(language.banned.defaultReason);

            if(!interaction.guild.members.cache.get(target.id)) { 
                await interaction.reply({ content: action.get(language.notAvailable), ephemeral: true});
                return;
            }
            if(target.id == interaction.member.user.id) { 
                await interaction.reply({ content: action.get(language.noPerms), ephemer: true});
                return;
            }

            if(interaction.options.getString('reason')) { reason = interaction.options.getString('reason'); }

            const Ban = await ban(interaction.guild.members.cache.get(target.id), reason);
            if(!Ban) return;

            await interaction.deferReply();
            reason = replaceAll(reason, '%username%', target.username);
            reason = replaceAll(reason, '%author%', interaction.member.user.username);

            let embed = new MessageEmbed()
                .setTitle(action.get(language.banned.title))
                .setDescription(reason)
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
        }
    }

    async function ban(user, reason) {
        try {
            return await user.ban({
                reason: reason
            }).catch( err => console.error(err));
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}