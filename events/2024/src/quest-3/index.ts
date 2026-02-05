import { runner, Solution } from "@jakemdunn/everybody-codes-runner";
import { Coord, Grid } from "@jakemdunn/everybody-codes-util/src/grid";
import inputs from "./inputs";

type Block = "." | "#" | number;

const dig = (input: string, deltas: Coord[]) => {
  const grid = new Grid<Block>(input);
  for (let block of grid) {
    grid.set(block, block?.value === "#" ? 1 : block?.value);
  }

  let depth = 1;
  let eligible = grid.findItems(depth);
  const iterate = () => {
    depth++;
    eligible = grid.findItems(depth);
  };
  for (; eligible.length; iterate()) {
    eligible.forEach((block) => {
      const surrounding = grid.getItemsAtDeltas(block, deltas);
      const canDig =
        surrounding.length === deltas.length &&
        surrounding.every(
          (adjacent) =>
            typeof adjacent.value === "number" && adjacent.value >= block.value,
        );
      if (canDig) {
        grid.set(block, block.value + 1);
      }
    });
  }

  return grid.buffer.reduce<number>((sum, value) => {
    return sum + (typeof value === "number" ? value : 0);
  }, 0);
};

const part1and2: Solution = (input: string) => dig(input, Grid.DELTAS.ADJACENT);
const part3: Solution = (input: string) => dig(input, Grid.DELTAS.SURROUNDING);

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
