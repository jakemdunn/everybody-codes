import fs from "fs";
import path from "node:path";
import { array, date, InferType, number, object, string } from "yup";

const resultsSchema = object({
  quest: string().required(),
  updated: date().default(() => new Date()),
  createdOn: date().default(() => new Date()),
  parts: array(
    object({
      answers: array(string()).required(),
      timing: number().required(),
    }),
  ).default([]),
  timingTotal: number(),
});
export type RunnerResults = InferType<typeof resultsSchema>;

export class RunnerTracking {
  private static logPath: string;
  public static results: RunnerResults;

  public static init(quest: string) {
    RunnerTracking.logPath = path.resolve(
      process.cwd(),
      `./src/quest-${quest}/results.json`,
    );

    RunnerTracking.results = resultsSchema.validateSync(
      fs.existsSync(RunnerTracking.logPath)
        ? JSON.parse(fs.readFileSync(RunnerTracking.logPath, "utf-8"))
        : {
            quest,
          },
    );
  }

  public static trackPart = (
    index: number,
    answer: unknown,
    timing: number,
  ) => {
    if (answer === undefined) {
      return;
    }
    const part: RunnerResults["parts"][0] = {
      answers: [
        ...new Set([
          ...(RunnerTracking.results.parts[index]?.answers ?? []),
          String(answer),
        ]).values(),
      ],
      timing,
    };
    RunnerTracking.results.parts[index] = part;
  };

  public static write = () => {
    RunnerTracking.results.updated = new Date();
    fs.writeFileSync(
      RunnerTracking.logPath,
      JSON.stringify(RunnerTracking.results, null, 2),
      "utf-8",
    );
  };

  private constructor() {}
}
