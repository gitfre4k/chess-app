const one2a = (num: number) => {
  const abc = ["x", "a", "b", "c", "d", "e", "f", "g", "h"];
  return abc[num];
};

const notations: () => [string[], [number, number][]] = () => {
  const algebraic: string[] = [];
  const xy: [number, number][] = [];
  for (let y = 8; y >= 1; y--) {
    for (let x = 1; x <= 8; x++) {
      algebraic.push(one2a(x) + y.toString());
      xy.push([x, y]);
    }
  }
  return [algebraic, xy];
};

const [algebraicNotation, xyNotation] = notations();

export { algebraicNotation, xyNotation };
