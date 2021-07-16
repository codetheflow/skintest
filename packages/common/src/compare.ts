type Operation<T> =
  {
    type: 'del',
    leftItem: T,
    leftIndex: number
  } |
  {
    type: 'mov',
    leftItem: T,
    rightItem: T,
    leftIndex: number,
    rightIndex: number,
  } |
  {
    type: 'add',
    rightItem: T,
    rightIndex: number
  };

export function compare<T>(left: T[], right: T[], equals: (a: T, b: T) => boolean): Operation<T>[] {
  const VISITED = Symbol('@skintest/common/compare/visited');
  const ops: Operation<T>[] = [];

  const ls = left;
  const rs: Array<T | typeof VISITED> = Array.from(right);
 
  for (let i = 0; i < ls.length; i++) {
    const l = ls[i];
    const j = rs.findIndex(r => r !== VISITED && equals(l, r));

    if (j < 0) {
      ops.push({
        type: 'del',
        leftItem: l,
        leftIndex: i,
      });

      continue;
    }

    rs[j] = VISITED;
    if (i !== j) {
      ops.push({
        type: 'mov',
        leftItem: l,
        rightItem: right[j],
        leftIndex: i,
        rightIndex: j,
      });
    }
  }

  for (let i = 0; i < rs.length; i++) {
    const r = rs[i];
    if (r === VISITED) {
      continue;
    }

    ops.push({
      type: 'add',
      rightItem: r,
      rightIndex: i,
    });
  }

  return ops;
}