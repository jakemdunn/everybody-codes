import { runner, Solution } from "@jakemdunn/everybody-codes-runner";
import inputs from "./inputs";

const parseInput = (input: string) => {
  const [, words, sentence] = [
    ...input.matchAll(/WORDS:([^\n]*)\n\n(.*)/gims),
  ][0];
  return {
    words: words.split(","),
    sentence,
  };
};

const part1: Solution = (input: string) => {
  const { words, sentence } = parseInput(input);
  return words.reduce(
    (sum, word) => sum + [...sentence.matchAll(new RegExp(word, "g"))].length,
    0,
  );
};

const part2: Solution = (input: string) => {
  const { words, sentence } = parseInput(input);
  const reversed = [
    ...new Set([
      ...words,
      ...words.map((word) => word.split("").reverse().join("")),
    ]).values(),
  ];
  const sorted = reversed.sort((a, b) => a.length - b.length);
  const patterns = sorted.reduce((accumulator, word) => {
    for (let index = 1; index < word.length; index++) {
      accumulator.push(
        `(?<=${word.substring(0, index)})${word.substring(index)}`,
      );
    }
    accumulator.push(word);
    return accumulator;
  }, [] as string[]);
  const regex = new RegExp(`(${patterns.join("|")})`, "g");
  const matches = sentence.matchAll(regex);
  return [...matches].reduce((sum, match) => sum + match[0].length, 0);
};

const part3: Solution = (input: string) => {
  const { words, sentence } = parseInput(input);
  const lineLength = sentence.indexOf("\n");
  const reversed = [
    ...new Set([
      ...words,
      ...words.map((word) => word.split("").reverse().join("")),
    ]).values(),
  ];
  const sorted = reversed.sort((a, b) => a.length - b.length);
  const patterns = sorted.reduce((accumulator, word) => {
    for (let index = 0; index < word.length; index++) {
      const linesBefore = word
        .substring(0, index)
        .split("")
        .join(`.{${lineLength}}`);
      const linesAfter = word
        .substring(index + 1)
        .split("")
        .join(`.{${lineLength}}`);
      accumulator.add(
        `${
          linesBefore ? `(?<=${linesBefore}.{${lineLength}})` : ""
        }${word.charAt(index)}${
          linesAfter ? `(?=.{${lineLength}}${linesAfter})` : ""
        }`,
      );
      if (index > 0) {
        accumulator.add(
          `(?<=${word.substring(0, index)})${word.substring(index)}`,
        );
        for (let startIndex = index - 1; startIndex > 0; startIndex--) {
          accumulator.add(
            `(?<=^${word.substring(startIndex, index)})${word.substring(index)}(?=.{${lineLength - word.length}}${word.substring(0, startIndex)})`,
          );
        }
        for (let endIndex = index + 1; endIndex < word.length; endIndex++) {
          accumulator.add(
            `(?<=^${word.substring(endIndex)}.{${lineLength - word.length}}${word.substring(0, index)})${word.substring(index, endIndex)}$`,
          );
        }
        accumulator.add(
          `(?<=^${word.substring(index)}.{${lineLength - word.length}})${word.substring(0, index)}$`,
        );
        accumulator.add(
          `^${word.substring(index)}(?=.{${lineLength - word.length}}${word.substring(0, index)}$)`,
        );
      }
    }
    accumulator.add(word);
    return accumulator;
  }, new Set<string>());
  const regex = new RegExp(`(${[...patterns.values()].join("|")})`, "gsm");
  const matches = sentence.matchAll(regex);
  return [...matches].reduce((sum, match) => sum + match[0].length, 0);
};

export default runner(
  [
    {
      solution: part1,
      tests: [
        {
          input: `WORDS:THE,OWE,MES,ROD,HER

AWAKEN THE POWER ADORNED WITH THE FLAMES BRIGHT IRE`,
          answer: 4,
        },
        {
          input: `WORDS:THE,OWE,MES,ROD,HER

THE FLAME SHIELDED THE HEART OF THE KINGS`,
          answer: 3,
        },
        {
          input: `WORDS:THE,OWE,MES,ROD,HER

POWE PO WER P OWE R`,
          answer: 2,
        },
        {
          input: `WORDS:THE,OWE,MES,ROD,HER

THERE IS THE END`,
          answer: 3,
        },
      ],
    },
    {
      solution: part2,
      tests: [
        {
          input: `WORDS:THE,OWE,MES,ROD,HER,QAQ

AWAKEN THE POWE ADORNED WITH THE FLAMES BRIGHT IRE
THE FLAME SHIELDED THE HEART OF THE KINGS
POWE PO WER P OWE R
THERE IS THE END
QAQAQ`,
          answer: 42,
        },
      ],
    },
    {
      solution: part3,
      testsOnly: false,
      tests: [
        {
          input: `WORDS:THE,OWE,MES,ROD,RODEO

HELWORLT
ENIGWDXL
TRODEOAL`,
          answer: 10,
        },
      ],
    },
  ],
  inputs,
);
