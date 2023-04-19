#!/usr/bin/env node
import chalk from "chalk";
import { Command } from "commander";
import fs from "fs/promises";
import ora from "ora";
import {
  checkProjectFolderExists,
  copyEnvFile,
  downloadTemplate,
  getPackageManager,
  runCommand,
} from "./helpers/index.js";
import packageJson from "./package.json";

const program = new Command();
program.version(packageJson.version);

program
  .argument(
    "<projectName>",
    "Name of the new Open Format dApp project"
  )
  .option(
    "--with-web2-auth",
    "Use the Web 2.0 authentication template"
  )
  .option(
    "--package-manager <packageManager>",
    "Specify the package manager to use (npm, yarn, or pnpm)"
  )
  .action(async (projectName, options) => {
    const template = options.withWeb2Auth
      ? "feature/web2auth"
      : "main";
    const spinner = ora(
      `Downloading dApp template (${template})...`
    ).start();
    try {
      if (await checkProjectFolderExists(projectName)) {
        spinner.fail(
          chalk.red(
            `A folder named "${projectName}" already exists. Please choose a different name.`
          )
        );
        process.exit(1);
      }

      await downloadTemplate(projectName, template);
      spinner.succeed(
        chalk.green("Template downloaded successfully.")
      );

      const packageManager = await getPackageManager(options);

      spinner.start(
        `Installing dependencies using ${packageManager}...`
      );
      await runCommand(packageManager, ["install"], {
        cwd: projectName,
        stdio: "pipe",
      });
      spinner.succeed(
        chalk.green("Dependencies installed successfully.")
      );

      await copyEnvFile(projectName);

      console.log(chalk.bold(`\nNext steps:\n`));
      console.log(chalk.cyan(`1. cd ${projectName}`));
      console.log(chalk.cyan(`2. ${packageManager} run dev\n`));
    } catch (error: any) {
      spinner.fail(
        chalk.red(`Failed to create the project. Cleaning up...`)
      );
      try {
        await fs.rm(projectName, { recursive: true, force: true });
        console.error(chalk.red(`Error: ${error.message}`));
      } catch (cleanupError: any) {
        console.error(
          chalk.red(`Error during cleanup: ${cleanupError.message}`)
        );
      }
      process.exit(1);
    }
  });

program.parse(process.argv);
