import { runner, Solution } from "@jakemdunn/everybody-codes-runner";
import inputs from "./inputs";

const costs = {
  A: 0,
  B: 1,
  C: 3,
  D: 5,
};

const getPotionCost = (mobsOrEmpty: string[]) => {
  const mobs = mobsOrEmpty.filter(
    (mob) => mob !== "x",
  ) as (keyof typeof costs)[];
  return mobs.reduce(
    (potions, mob) => potions + costs[mob],
    mobs.length * (mobs.length - 1),
  );
};

const part1: Solution = (input: string) => {
  return (input.split("") as (keyof typeof costs)[]).reduce(
    (potions, mob) => potions + costs[mob],
    0,
  );
};

const part2: Solution = (input: string) => {
  const mobs = [...input.matchAll(/(.)(.)/gi)];
  return mobs.reduce(
    (potions, [, mob1, mob2]) => potions + getPotionCost([mob1, mob2]),
    0,
  );
};

const part3: Solution = (input: string) => {
  const mobs = [...input.matchAll(/(.)(.)(.)/gi)];
  return mobs.reduce(
    (potions, [, mob1, mob2, mob3]) =>
      potions + getPotionCost([mob1, mob2, mob3]),
    0,
  );
};

export default runner(
  [
    {
      solution: part1,
      tests: [
        {
          input: `ABBAC`,
          answer: 5,
        },
      ],
    },
    {
      solution: part2,
      tests: [
        {
          input: `AxBCDDCAxD`,
          answer: 28,
        },
      ],
    },
    {
      solution: part3,
      tests: [
        {
          input: `xBxAAABCDxCC`,
          answer: 30,
        },
      ],
    },
  ],
  inputs,
);
