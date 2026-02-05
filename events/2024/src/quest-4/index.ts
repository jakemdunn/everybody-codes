import { runner, Solution } from "@jakemdunn/everybody-codes-runner";
import inputs from "./inputs";

const parseInput = (input: string) =>
  input.split("\n").map((nail) => parseInt(nail));

const part1and2: Solution = (input: string) => {
  const nails = parseInput(input);
  const min = nails.reduce((prev, nail) => Math.min(prev, nail));
  return nails.reduce((sum, nail) => sum + nail - min, 0);
};

const part3: Solution = (input: string) => {
  const nails = parseInput(input).sort();
  const mid = nails.length / 2;
  const median =
    mid % 1 !== 0
      ? Math.floor((nails[mid - 0.5] + nails[mid + 0.5]) / 2)
      : nails[mid];
  return nails.reduce((sum, nail) => sum + Math.abs(nail - median), 0);
};

export default runner(
  [
    {
      solution: part1and2,
      tests: [
        {
          input: `3
4
7
8`,
          answer: 10,
        },
      ],
    },
    {
      solution: part1and2,
      tests: [],
    },
    {
      solution: part3,
      tests: [
        {
          input: `2
4
5
8
6`,
          answer: 8,
        },
      ],
    },
  ],
  inputs,
);
