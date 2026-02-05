import { runner, Solution } from "@jakemdunn/everybody-codes-runner";
import inputs from "./input";

const parseInput = (input: string) => {
  const [names, instructions] = input.split("\n\n");
  return {
    names: names.split(","),
    instructions: instructions.split(",").map((instruction) => {
      return (
        parseInt(instruction.substring(1)) *
        (instruction.charAt(0) === "R" ? 1 : -1)
      );
    }),
  };
};

const modulus = (input: number, n: number) => ((input % n) + n) % n;

const part1: Solution = (input) => {
  const { names, instructions } = parseInput(input);
  const index = instructions.reduce(
    (current, movement) =>
      Math.max(Math.min(current + movement, names.length - 1), 0),
    0,
  );
  return names[index];
};

const part2: Solution = (input) => {
  const { names, instructions } = parseInput(input);
  const index = instructions.reduce(
    (current, movement) => modulus(current + movement, names.length),
    0,
  );
  return names[index];
};

const part3: Solution = (input) => {
  const { names, instructions } = parseInput(input);
  instructions.forEach((instruction) => {
    const targetIndex = modulus(instruction, names.length);
    const currentParent = names[0];
    const nextParent = names[targetIndex];
    names[targetIndex] = currentParent;
    names[0] = nextParent;
  });
  return names[0];
};

runner(
  [
    {
      solution: part1,
      tests: [
        {
          input: `Vyrdax,Drakzyph,Fyrryn,Elarzris

R3,L2,R3,L1`,
          answer: "Fyrryn",
        },
      ],
    },
    {
      solution: part2,
      tests: [
        {
          input: `Vyrdax,Drakzyph,Fyrryn,Elarzris

R3,L2,R3,L1`,
          answer: "Elarzris",
        },
      ],
    },
    {
      solution: part3,
      tests: [
        {
          input: `Vyrdax,Drakzyph,Fyrryn,Elarzris

R3,L2,R3,L3`,
          answer: "Drakzyph",
        },
      ],
    },
  ],
  inputs,
);
