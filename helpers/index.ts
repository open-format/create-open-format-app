import chalk from "chalk";
import { SpawnOptions, spawn } from "child_process";
//@ts-ignore
import fs from "fs-extra";
import path from "path";
import prompts from "prompts";
import which from "which";
import { exec } from "child_process";

export async function getPackageManager(options: {
  [key: string]: string;
}): Promise<string> {
  if (
    options.packageManager &&
    ["npm", "yarn", "pnpm"].includes(options.packageManager)
  ) {
    return which.sync(options.packageManager);
  } else {
    for (const pm of ["yarn", "pnpm", "npm"]) {
      try {
        const packageManagerPath = which.sync(pm);
        return packageManagerPath;
      } catch (error) {
        // Ignore the error and try the next package manager
      }
    }
    throw new Error("No supported package manager found (npm, yarn, or pnpm).");
  }
}

export function downloadTemplate(
  projectName: string,
  template: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const gitCommand = `git clone -b ${template} https://github.com/open-format/hello-world.git ${projectName}`;
    exec(gitCommand, (error: Error | null, stdout: string, stderr: string) => {
      if (error) {
        console.error("Error details:", error);
        console.error("Git command output:", stderr);
        reject(error);
      } else {
        console.log("Git command output:", stdout);
        resolve(true);
      }
    });
  });
}

export async function copyEnvFile(projectName: string) {
  const envPath = path.resolve(projectName, ".env.local");
  const envTemplatePath = path.resolve(projectName, ".env.local.example");

  const envVars: Record<string, string> = {};
  const envExists = await fs.pathExists(envPath);
  if (envExists) {
    const envFile = await fs.readFile(envPath, "utf-8");
    envFile.split("\n").forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value) {
        envVars[key] = value;
      }
    });
  } else {
    await fs.copyFile(envTemplatePath, envPath);
  }

  envVars.NEXT_PUBLIC_APP_ID = await promptRequired(
    "Enter your app ID (Generate app ID from https://apps.openformat.tech/): "
  );
  envVars.NEXT_PRIVATE_KEY = await promptRequired(
    "Enter your private key (We do not store or have access to this value): "
  );

  const envContents = Object.entries(envVars)
    .map(([key, value]) => `${key}="${value}"`)
    .join("\n");

  await fs.writeFile(envPath, envContents);

  console.log(
    chalk.bold(
      `${chalk.green(
        "✔"
      )} APP_ID and PRIVATE_KEY environment variables set in ${envPath}`
    )
  );
}

async function promptRequired(message: string): Promise<string> {
  let value: string | undefined;
  while (!value) {
    const response = await prompts({
      type: "text",
      name: "value",
      message,
    });
    value = response.value;
    if (!value) {
      console.error("Value is required.");
    }
  }
  return value;
}

export function runCommand(
  command: string,
  args: string[],
  options: SpawnOptions
) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, options);

    childProcess.on("error", (error) => {
      reject(error);
    });

    childProcess.on("exit", (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

export async function checkProjectFolderExists(projectName: string) {
  try {
    await fs.stat(projectName);
    return true;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}
