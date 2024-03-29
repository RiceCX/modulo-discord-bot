const fse = require("fs-extra");
const fs = require("fs");
const chalk = require("chalk");
async function getDirectories(path) {
  let filesAndDirectories = await fse.readdir(path);

  let directories = [];
  await Promise.all(
    filesAndDirectories.map(name => {
      return fse.stat(path + name).then(stat => {
        if (stat.isDirectory()) directories.push(name);
      });
    })
  );
  return directories;
}

async function getCommandsFromDirectory(commandName, Bot) {
  // Files In that directory
  await fs.readdir(`./Bot/commands/${commandName}`, (err, files) => {
    console.log(`[${commandName}]: [${files.length}]`);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`../commands/${commandName}/${file}`);
      let name = file.split(".")[0];
      Bot.commands.set(props.help.name, {
        command: props,
        aliases: props.help.alias,
        category: commandName
      });
      Bot.aliases.set(props.help.alias, {
        command: props,
        aliases: props.help.name,
        category: commandName
      });
      console.log(`Loaded command: ${name} ✓ `);
    });
  });
}
module.exports = async Bot => {
  // Command Handler
  console.log("[LOADING COMMANDS]");
  let dirs = await getDirectories("./Bot/commands/");
  if (!dirs) return console.log(chalk.bgred("No Categories Found!"));
  dirs.forEach(e => {
    getCommandsFromDirectory(e, Bot);
  });
};
