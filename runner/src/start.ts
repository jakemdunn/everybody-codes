import { styleText } from "node:util";
import fs from "fs";
import path from "node:path";

const checkTemplate = (template: string, quest: number) => {
  const templateDirectory = path.resolve(import.meta.dirname, "../template");
  const targetDirectory = path.resolve(process.cwd(), `./src/quest-${quest}`);
  const targetPath = path.resolve(targetDirectory, `${template}.ts`);

  if (!fs.existsSync(templateDirectory)) {
    fs.mkdirSync(templateDirectory);
  }
  if (!fs.existsSync(targetPath)) {
    fs.copyFileSync(
      path.resolve(templateDirectory, `${template}.ts`),
      targetPath,
    );
  }
};
export const start = (event: number) => {
  const quest = parseInt(process.argv[2]);
  if (!quest || isNaN(quest)) {
    console.error(
      styleText(
        "red",
        'No quest specified. Provide a quest e.g.: "yarn start 1"',
      ),
    );
    return;
  }

  checkTemplate("index", quest);
  checkTemplate("inputs", quest);

  console.error(styleText("blue", `Running Quest ${quest} for ${event}`));
  import(path.resolve(process.cwd(), `./src/quest-${quest}`));
};
