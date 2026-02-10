import { styleText } from "node:util";
import { RunnerTracking } from "./tracking";

export type Solution<Params extends unknown[] = any[]> = (
  input: string,
  ...params: Params
) => unknown;

type RestParams<T> = T extends (input: string, ...args: infer P) => any
  ? P
  : undefined;

export interface RunnerConfig<RunnerSolution extends Solution = Solution> {
  solution: RunnerSolution;
  testsOnly?: boolean;
  tests: {
    input: string;
    params?: RestParams<RunnerSolution>;
    answer: string | number | BigInt;
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
  tests.forEach(({ input, answer, params }, testIndex) => {
    const testLabel = `Test ${partIndex + 1}:${testIndex + 1}`;
    const testMark = `test-${partIndex}-${testIndex}`;
    performance.mark(testMark);
    const output = solution(input, ...(params ?? []));
    performance.measure(testLabel, testMark);
    const time = getTime(testLabel);
    if (output === answer) {
      console.log(styleText("green", `${testLabel} passed in ${time}`));
    } else {
      console.error(
        styleText(
          "red",
          `${testLabel} failed. (╯°□°）╯︵ ┻━┻\n  Expected "${answer}", got "${output}" in ${time}`,
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
  RunnerTracking.trackPart(
    partIndex,
    solve,
    performance.getEntriesByName(label)[0].duration,
  );
  console.log(`${label}: "${solve}" in ${getTime(label)}`);
};

export const runner = (configs: RunnerConfig[], inputs: string[]) => {
  configs.forEach((part, index) => {
    partRunner(part, inputs[index], index);
  });

  console.log(styleText("blue", `\n\nTiming:`));
  const totalTime = performance.getEntries().reduce<number>((total, entry) => {
    if (entry.name.startsWith("Solution")) {
      console.log(
        styleText("white", `${entry.name}: ${entry.duration.toFixed(4)}ms`),
      );
      return total + entry.duration;
    }
    return total;
  }, 0);
  RunnerTracking.results.timingTotal = totalTime;
  RunnerTracking.write();

  console.log(styleText("white", `-------\nTotal: ${totalTime.toFixed(4)}ms`));
};
