import { runner, Solution } from "@jakemdunn/everybody-codes-runner";
import inputs from "./inputs";
import { simpleHash } from "@jakemdunn/everybody-codes-util";

const parseInput = (input: string) => {
  return input.split("\n").reduce<number[][]>((columns, row) => {
    row.split(" ").forEach((clapper, index) => {
      if (!columns[index]) {
        columns[index] = [];
      }
      columns[index].push(parseInt(clapper));
    });
    return columns;
  }, []);
};

const dance = (columns: number[][], round: number) => {
  const columnIndex = round % columns.length;
  const destIndex = (round + 1) % columns.length;
  const sourceColumn = columns[columnIndex];
  const destColumn = columns[destIndex];
  const dancer = sourceColumn.shift()!;

  const loopLength = 2 * destColumn.length;
  const position = (dancer - 1) % loopLength;
  const insertionIndex = Math.min(position, loopLength - position);

  destColumn.splice(insertionIndex, 0, dancer);
};

const shout = (columns: number[][]) =>
  BigInt(columns.map((column) => column[0]).join(""));

function* runDelay(delay: number) {
  const start = performance.now();
  while (true) {
    yield performance.now() - start > delay;
  }
}

const part1 = (input: string, iterations = 10) => {
  const columns = parseInput(input);
  for (let round = 0; round < iterations; round++) {
    dance(columns, round);
  }
  return shout(columns);
};

const part2: Solution = (input) => {
  const columns = parseInput(input);
  const shouts = new Map<BigInt, number>();
  const delay = runDelay(2000);
  for (let round = 0; delay.next().value === false; round++) {
    dance(columns, round);
    const current = shout(columns);
    shouts.set(current, (shouts.get(current) ?? 0) + 1);
    if (shouts.get(current)! >= 2024) {
      return BigInt(round + 1) * current;
    }
  }
};

const part3: Solution = (input) => {
  const columns = parseInput(input);
  const delay = runDelay(2000);

  let maxShout = BigInt(0);
  const states = new Set<number>();

  for (let round = 0; delay.next().value === false; round++) {
    dance(columns, round);
    const currentShout = shout(columns);
    const state = simpleHash(JSON.stringify(columns));

    if (states.has(state)) {
      break;
    }
    states.add(state);

    if (currentShout > maxShout) {
      maxShout = currentShout;
      continue;
    }
  }

  return maxShout;
};

export default runner(
  [
    {
      solution: part1,
      tests: [
        ...[3345, 3245, 3255, 3252, 4252, 4452, 4422, 4423, 2423, 2323].map(
          (answer, index) => ({
            input: `2 3 4 5
3 4 5 2
4 5 2 3
5 2 3 4`,
            params: [index + 1],
            answer: BigInt(answer),
          }),
        ),
        ...[6345, 6245, 6285, 5284, 6584, 6254, 6285, 5284, 6584, 6254].map(
          (answer, index) => ({
            input: `2 3 4 5
6 7 8 9`,
            params: [index + 1],
            answer: BigInt(answer),
          }),
        ),
      ],
    },
    {
      solution: part2,
      tests: [
        {
          input: `2 3 4 5
6 7 8 9`,
          answer: BigInt(50877075),
        },
      ],
    },
    {
      solution: part3,
      tests: [
        {
          input: `2 3 4 5
6 7 8 9`,
          answer: BigInt(6584),
        },
      ],
    },
  ],
  inputs,
);
