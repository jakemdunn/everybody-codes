export type Coord = [number, number];
export interface Item<T = unknown> {
  index: number;
  value: T;
}
export type MaybeIndex = Item | number;

export class Grid<T> {
  public buffer: Array<T>;

  public readonly width: number;
  public readonly height: number;

  public static readonly DELTAS = {
    SURROUNDING: [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ] as Coord[],
    ADJACENT: [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ] as Coord[],
  } as const;

  [Symbol.iterator]() {
    var index = 0;
    return {
      next: () => ({
        done: !(index in this.buffer),
        value: this.getItem(index++)!,
      }),
    };
  }

  public findItems = <C extends T>(...search: C[]) => {
    return this.buffer.reduce<Item<C>[]>((items, character, index) => {
      if (search.includes(character as C)) {
        items.push(this.getItem(index) as Item<C>);
      }
      return items;
    }, []);
  };

  public getItem = (target: MaybeIndex): Item<T> | undefined => {
    const index = this.getMaybeIndex(target);
    return this.buffer[index]
      ? { index, value: this.buffer[index] }
      : undefined;
  };

  public set = (target: MaybeIndex, character: T) => {
    const index = this.getMaybeIndex(target);
    this.buffer[index] = character;
  };

  public inBounds = ([x, y]: Coord) =>
    x >= 0 && y >= 0 && x < this.width && y < this.height;

  public getItemsAtDeltas = (target: MaybeIndex, deltas: Coord[]) => {
    const index = this.getMaybeIndex(target);
    const [x, y] = this.getCoord(target);
    return deltas.reduce((items, [deltaX, deltaY]) => {
      if (!this.inBounds([x + deltaX, y + deltaY])) return items;
      const item = this.getItem(index + deltaX + deltaY * this.width);
      return item ? [...items, item] : items;
    }, [] as Item<T>[]);
  };

  public getCoord = (target: MaybeIndex) => {
    const index = this.getMaybeIndex(target);
    return [index % this.width, Math.floor(index / this.width)] as Coord;
  };

  public getMaybeIndex = (target: MaybeIndex) =>
    typeof target === "number" ? target : target.index;

  public toString = () =>
    this.buffer.join("").replace(new RegExp(`(.{${this.width}})`, "g"), "$1\n");

  constructor(input: string) {
    this.buffer = input.replace(/\n/gm, "").split("") as T[];
    this.width = input.indexOf("\n");
    this.height = Math.ceil(this.buffer.length / this.width);
  }
}
