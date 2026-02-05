import { runner, Solution } from "@jakemdunn/everybody-codes-runner";
import { Coord, Grid } from "@jakemdunn/everybody-codes-util/src/grid";
import inputs from "./inputs";

type Block = "." | "#" | number;

const dig = (
  input: string,
  createRegex: (depth: string, lineLength: number) => string,
) => {
  let grid = input.replaceAll("#", "1");
  const lineLength = grid.indexOf("\n");
  for (let depth = 1; grid.includes(`${depth}`); depth++) {
    const regex = new RegExp(
      createRegex(`[${depth}${depth + 1}]`, lineLength),
      "gms",
    );
    grid = grid.replaceAll(regex, `${depth + 1}`);
  }

  return grid.split("").reduce<number>((sum, block) => {
    const value = parseInt(block);
    return sum + (value ? value : 0);
  }, 0);
};

const part1and2: Solution = (input: string) =>
  dig(
    input,
    (depth, lineLength) =>
      `(?<=${depth})(?<=${depth}.{${lineLength}})${depth}(?=.{${lineLength}}${depth})(?=${depth})`,
  );
const part3: Solution = (input: string) =>
  dig(
    input,
    (depth, lineLength) =>
      `(?<=${depth}{3}.{${lineLength - 2}}${depth})${depth}(?=${depth}.{${lineLength - 2}}${depth}{3})`,
  );

export default runner(
  [
    {
      solution: part1and2,
      tests: [
        {
          input: `..........
..###.##..
...####...
..######..
..######..
...####...
..........`,
          answer: 35,
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
          input: `..........
..###.##..
...####...
..######..
..######..
...####...
..........`,
          answer: 29,
        },
      ],
    },
  ],
  inputs,
);
