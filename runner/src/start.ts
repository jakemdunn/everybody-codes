import { styleText } from "node:util";
import fs from "fs";
import path from "node:path";
import { RunnerTracking } from "./tracking";

const checkTemplate = (template: string, quest: string) => {
  const templateDirectory = path.resolve(import.meta.dirname, "../template");
  const targetDirectory = path.resolve(process.cwd(), `./src/quest-${quest}`);
  const targetPath = path.resolve(targetDirectory, `${template}.ts`);

  if (!fs.existsSync(targetDirectory)) {
    fs.mkdirSync(targetDirectory);
  }
  if (!fs.existsSync(targetPath)) {
    fs.copyFileSync(
      path.resolve(templateDirectory, `${template}.ts`),
      targetPath,
    );
  }
};

export const start = (event: number) => {
  const quest = process.argv[2];
  if (!quest || isNaN(parseInt(quest))) {
    console.error(
      styleText(
        "red",
        'Invalid quest specified. Provide a quest e.g.: "yarn start 1" or "yarn start 1-variant',
      ),
    );
    return;
  }

  checkTemplate("index", quest);
  checkTemplate("inputs", quest);

  RunnerTracking.init(quest);

  console.error(styleText("blue", `Running Quest ${quest} for ${event}`));
  import(path.resolve(process.cwd(), `./src/quest-${quest}`));
};
