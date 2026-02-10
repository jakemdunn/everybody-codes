import { runner, Solution } from "@jakemdunn/everybody-codes-runner";
import inputs, { TRACKS } from "./inputs";
import { Grid, Item, MaybeIndex } from "@jakemdunn/everybody-codes-util";

interface Plan {
  label: string;
  power: number;
  essense: number;
  actions: Action[];
}

const parseInput = (input: string) => {
  const plans = input.split("\n").map((line) => {
    const [label, actions] = line.split(":");
    return {
      label,
      power: 10,
      essense: 0,
      actions: actions?.split(","),
    } as Plan;
  });
  return plans;
};

const parseTrack = (input: string) => {
  const grid = new Grid<Action | " ">(input);
  let from: MaybeIndex = 1;
  const track = new Set<number>([1]);
  while (true) {
    const next: Item = grid
      .getItemsAtDeltas(from, Grid.DELTAS.ADJACENT)
      .filter(
        (item) => ![" ", "S"].includes(item.value) && !track.has(item.index),
      )[0];
    if (!next) {
      track.add(0);
      break;
    }
    track.add(next.index);
    from = next;
  }
  return [...track.values()].map((item) => grid.buffer[item]) as Action[];
};

const ACTIONS = {
  S: 0,
  "+": 1,
  "=": 0,
  "-": -1,
} as const;
type Action = keyof typeof ACTIONS;

const race = (
  plans: Plan[],
  continueRacing: (segment: number, laps: number) => boolean,
  track?: Action[],
  onLap?: (laps: number, plans: Plan[]) => Plan[],
) => {
  for (let segment = 0, laps = 0; continueRacing(segment, laps); segment++) {
    const trackSegment = track?.[segment % track.length];
    const trackAction = trackSegment && ACTIONS[trackSegment];
    if (trackSegment === "S") {
      laps++;
      plans = onLap?.(laps, plans) ?? plans;
    }
    plans.forEach((plan) => {
      const action =
        trackAction !== undefined && trackAction !== 0
          ? trackAction
          : ACTIONS[plan.actions[segment % plan.actions.length]];
      plan.power = Math.max(plan.power + action, 0);
      plan.essense += plan.power;
    });
  }
};

const part1: Solution = (input) => {
  const plans = parseInput(input);
  race(plans, (segment) => segment < 10);
  plans.sort((a, b) => b.essense - a.essense);
  return plans.map((plan) => plan.label).join("");
};

const part2: Solution = (input, inputTrack) => {
  const plans = parseInput(input);
  const track = parseTrack(inputTrack ?? TRACKS.part2);
  race(plans, (_, laps) => laps < 10, track);
  plans.sort((a, b) => b.essense - a.essense);
  return plans.map((plan) => plan.label).join("");
};

const part3: Solution = (input, inputTrack) => {
  const track = parseTrack(inputTrack ?? TRACKS.part3);

  const getOptions = (
    actions: Partial<Record<Action, number>>,
    current = "",
    options = new Set<string>(),
  ) => {
    Object.entries(actions).forEach(([action, count]) => {
      if (!count) return;
      const option = current + action;
      if (!options.has(option)) {
        options.add(option);
        getOptions({ ...actions, [action]: count - 1 }, option, options);
      }
    });
    return options;
  };

  const options = [...getOptions({ ["+"]: 5, ["-"]: 3, ["="]: 3 }).values()]
    .filter((option) => option.length === 11)
    .map<Plan>((option, index) => ({
      label: `generated-${index}`,
      power: 10,
      essense: 0,
      actions: option.split("") as Action[],
    }));

  let plans = [...parseInput(input), ...options];
  race(
    plans,
    (_, laps) => laps < 2024,
    track,
    (laps, plans) => {
      if (laps % 100 === 0) {
        return plans.filter(
          (plan, index) => index === 0 || plan.essense > plans[0].essense,
        );
      }
      return plans;
    },
  );
  return plans.filter((plan) => plan.essense > plans[0].essense).length;
};

export default runner(
  [
    {
      solution: part1,
      tests: [
        {
          input: `A:+,-,=,=
B:+,=,-,+
C:=,-,+,+
D:=,=,=,+`,
          answer: "BDCA",
        },
      ],
    },
    {
      solution: part2,
      tests: [
        {
          input: `A:+,-,=,=
B:+,=,-,+
C:=,-,+,+
D:=,=,=,+`,
          params: [
            `S+===
-   +
=+=-+`,
          ],
          answer: "DCBA",
        },
      ],
    },
    {
      solution: part3,
      tests: [],
    },
  ],
  inputs,
);
