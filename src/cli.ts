#!/usr/bin/env node

import { Command } from "commander";
// import * as glyphForge from "./index";

const program = new Command();

program
  .name("glyph-forge")
  .description("CLI for glyph-forge library")
  .version("1.0.0");

program
  .command("command")
  .description("Description of your command")
  .option("--commandFlag", "Description of the flag")
  .option("--commandProperty <value>", "Description of the property")
  .action((options) => {
    // Your command logic here
    console.log("Command executed with options:", options);
  });

program.parse(process.argv);
