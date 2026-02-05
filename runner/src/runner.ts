import { styleText } from "node:util";

export type Solution = (input: string) => unknown;
export interface RunnerConfig {
  solution: Solution;
  testsOnly?: boolean;
  tests: {
    input: string;
    answer: string | number;
  }[];
}

const getTime = (label: string) => {
  const time = performance.getEntriesByName(label);
  return `${time[0].duration.toFixed(4)}ms`;
};
const partRunner = (
  { solution, tests, testsOnly }: RunnerConfig,
  input: string,
  partIndex: number,
) => {
  console.log(styleText("dim", `\n\nPart ${partIndex + 1} ━━━━━ ᕦ(ò_óˇ)ᕤ`));
  tests.forEach(({ input, answer }, testIndex) => {
    const testLabel = `Test ${partIndex + 1}:${testIndex + 1}`;
    const testMark = `test-${partIndex}-${testIndex}`;
    performance.mark(testMark);
    const output = solution(input);
    performance.measure(testLabel, testMark);
    const time = getTime(testLabel);
    if (output === answer) {
      console.log(styleText("green", `${testLabel} passed in ${time}`));
    } else {
      console.error(
        styleText(
          "red",
          `${testLabel} failed. (╯°□°）╯︵ ┻━┻\nExpected "${answer}", got "${output}" in ${time}`,
        ),
      );
    }
  });

  if (testsOnly) return;

  const label = `Solution ${partIndex + 1}`;
  const markName = `solve-${partIndex}`;
  performance.mark(markName);
  const solve = solution(input);
  performance.measure(label, markName);
  console.log(`${label}: "${solve}" in ${getTime(label)}`);
};

export const runner = (configs: RunnerConfig[], inputs: string[]) => {
  configs.forEach((part, index) => {
    partRunner(part, inputs[index], index);
  });

  const totalTime = performance.getEntries().reduce<number>((total, entry) => {
    if (entry.name.startsWith("Test")) {
      return total + entry.duration;
    }
    return total;
  }, 0);

  console.log(styleText("blue", `\n\nTotal Time:\n${totalTime.toFixed(4)}ms`));
};
