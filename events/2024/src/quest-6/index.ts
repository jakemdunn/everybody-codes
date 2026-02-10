import { runner, Solution } from "@jakemdunn/everybody-codes-runner";
import inputs from "./inputs";

const parseInput = (input: string) => {
  return input.split("\n").reduce((nodes, line) => {
    const [source, destinations] = line.split(":");
    nodes.set(source, destinations?.split(","));
    return nodes;
  }, new Map<string, string[]>());
};

const findPowerfulPath = (input: string) => {
  const nodes = parseInput(input);
  const paths = new Set([["RR"]]);
  const fruitPaths = new Set<string[]>();
  while (paths.size) {
    const path = paths.values().next().value!;
    paths.delete(path);
    nodes.get(path[path.length - 1])?.forEach((child) => {
      if (path.includes(child)) {
        return;
      }
      if (child === "@") {
        fruitPaths.add([...path, child]);
      } else {
        paths.add([...path, child]);
      }
    });
  }

  const lengths = new Map<number, string[][]>();
  fruitPaths.forEach((path) => {
    lengths.set(path.length, [...(lengths.get(path.length) ?? []), path]);
  });

  return [...lengths.values()].reduce((shortest, paths) => {
    return paths.length < shortest.length ? paths : shortest;
  })[0];
};

const part1: Solution = (input) => {
  return findPowerfulPath(input).join("");
};

const part2: Solution = (input) => {
  return findPowerfulPath(input)
    .map((node) => node.charAt(0))
    .join("");
};

const part3: Solution = (input) => {
  return findPowerfulPath(input)
    .map((node) => node.charAt(0))
    .join("");
};

export default runner(
  [
    {
      solution: part1,
      tests: [
        {
          input: `RR:A,B,C
A:D,E
B:F,@
C:G,H
D:@
E:@
F:@
G:@
H:@`,
          answer: "RRB@",
        },
      ],
    },
    {
      solution: part2,
      tests: [],
    },
    {
      solution: part3,
      tests: [],
    },
  ],
  inputs,
);
