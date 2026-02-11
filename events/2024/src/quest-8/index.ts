import { runner, Solution } from "@jakemdunn/everybody-codes-runner";
import inputs from "./inputs";

const part1: Solution = (input) => {
  const blocks = parseInt(input);
  const limit = Math.round(Math.sqrt(4 * blocks));
  const target = Math.pow(limit + (limit % 2 === 0 ? 0 : 1), 2) / 4;
  return limit * (target - blocks);
};

const part2: Solution = (input, acolytes = 1111, startingBlocks = 20240000) => {
  const priests = parseInt(input);
  for (
    let width = 1, depth = 1, blocks = startingBlocks;
    blocks > 0;
    width += 2
  ) {
    const nextDepth = (depth * priests) % acolytes;
    blocks -= width * depth;
    depth = nextDepth;
    if (blocks < 0) {
      return Math.abs(blocks) * width;
    }
  }
};

const part3: Solution = (input, acolytes = 10, startingBlocks = 202400000) => {
  const priests = parseInt(input);
  const depths: number[] = [1];
  for (let width = 1; width < 99999; width += 2) {
    let depth = depths[depths.length - 1];
    if (depth !== 1) {
      const priestsByDepth = priests * width;
      const pyramid = [...depths].reverse().reduce(
        ({ totalBlocks, currentDepth }, addedDepth, index) => {
          if (index === 0) {
            return {
              totalBlocks: addedDepth * 2,
              currentDepth: addedDepth,
            };
          }
          const columnDepth = currentDepth + addedDepth;
          const removed = (priestsByDepth * columnDepth) % acolytes;
          return {
            currentDepth: columnDepth,
            totalBlocks:
              totalBlocks +
              (columnDepth - removed) * (index === depths.length - 1 ? 1 : 2),
          };
        },
        { totalBlocks: 0, currentDepth: 0 },
      );
      if (pyramid.totalBlocks >= startingBlocks) {
        return pyramid.totalBlocks - startingBlocks;
      }
    }
    depths.push(((depth * priests) % acolytes) + acolytes);
  }
};

export default runner(
  [
    {
      solution: part1,
      tests: [
        {
          input: `13`,
          answer: 21,
        },
      ],
    },
    {
      solution: part2,
      tests: [
        {
          input: `3`,
          params: [5, 50],
          answer: 27,
        },
      ],
    },
    {
      solution: part3,
      tests: [
        {
          input: `2`,
          params: [5, 67],
          answer: 0,
        },
        {
          input: `2`,
          params: [5, 160],
          answer: 2,
        },
      ],
    },
  ],
  inputs,
);
