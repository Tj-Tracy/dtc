import discord, { Client } from "discord.js";
import dotenv from "dotenv";
import readline from "readline";
import chalk from "chalk";
import Dtsh from "./helpers";
dotenv.config();

//helper library
const dtsh = new Dtsh();
//discord client
const user = new discord.Client();
//readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: `>>> `
});

const connectedServer = {
  serverName: null,
  channelName: null
};

//clear the terminal
dtsh.clear();

user.login(process.env.USER_TOKEN);
user.on("ready", () => {
  process.stdout.write(
    `
    ____           ______          ______
   / __ \\         /_  __/         / ____/
  / / / /          / /           / /     
 / /_/ /          / /           / /___   
/_____/iscord    /_/erminal     \\____/hat   
                                     
`
  );
  console.log(`Logged in as ${chalk.magenta(user.user.tag)}\n\n`);
  console.log("List of servers: ");
  let servers = dtsh.createArrayFromCollection(user.guilds, "name");
  servers.map((server, i) => console.log(`${i + 1}) ${chalk.green(server)}`));

  // ask the user which discord they'd like to join.
  rl.question("\nServer #: ", answer => {
    readline.moveCursor(process.stdout, 0, -1);
    // TODO: check if it is a digit
    answer = parseInt(answer);
    const serverName = servers[answer - 1];
    console.log(`List of channels for ${chalk.green(serverName)}`);

    if (user.guilds.find("name", serverName)) {
      connectedServer.serverName = serverName;
      let channelList = user.guilds
        .find("name", serverName)
        .channels.filter(channel => channel.type === "text");
      channelList = dtsh.createArrayFromCollection(channelList, "name");
      channelList.map((channel, i) =>
        console.log(`${i + 1}) ${chalk.green(channel)}`)
      );

      rl.question("\nChannel #: ", answer => {
        readline.moveCursor(process.stdout, 0, -1);
        // TODO: check if it is a digit
        answer = parseInt(answer);
        const channelName = channelList[answer - 1];
        connectedServer.channelName = channelName;
        user.guilds
          .find("name", serverName)
          .channels.find("name", channelName)
          .fetchMessages({ limit: 25 })
          .then(messages => {
            const msgs = [];
            messages.map(message => {
              msgs.push(
                `${chalk.magenta(message.author.username)}> ${message.content}`
              );
            });
            msgs.reverse();
            dtsh.clear();
            console.log(
              `Server: ${chalk.green(
                connectedServer.serverName
              )} Channel: ${chalk.green(connectedServer.channelName)}`
            );
            msgs.map(msg => console.log(msg));
            rl.prompt();
          })
          .catch(console.error);
      });
    }
  });
});

//when a message is recieved in the proper room, display it.
user.on("message", message => {
  if (
    message.guild.name === connectedServer.serverName &&
    message.channel.name === connectedServer.channelName
  ) {
    console.log(
      `${chalk.magenta(message.author.username)}> ${message.content}`
    );
  }
});

rl.on("line", line => {
  readline.moveCursor(process.stdout, 0, -2);
  user.guilds.find("name", connectedServer.serverName).channels.find("name", connectedServer.channelName).send(line)
  .then(() => rl.prompt())
});

// user.guilds.find("name", answer).channels.find("name", "no-bully").fetchMessages({ limit: 10 })
//   .then(messages => console.log(messages.map(message => { return `${message.author.username}> ${message.content}`})))
//   .catch(console.error);
