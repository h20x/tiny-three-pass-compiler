const { Optimizer } = require('./optimizer');

describe('Optimizer', () => {
  test.each([
    [
      { op: 'imm', n: 1 },
      { op: 'imm', n: 1 },
    ],
    [
      {
        op: '+',
        a: { op: 'imm', n: 1 },
        b: { op: 'imm', n: 2 },
      },
      { op: 'imm', n: 3 },
    ],
    [
      {
        op: '-',
        a: { op: 'imm', n: 1 },
        b: { op: 'imm', n: 2 },
      },
      { op: 'imm', n: -1 },
    ],
    [
      {
        op: '*',
        a: { op: 'imm', n: 1 },
        b: { op: 'imm', n: 2 },
      },
      { op: 'imm', n: 2 },
    ],
    [
      {
        op: '/',
        a: { op: 'imm', n: 1 },
        b: { op: 'imm', n: 2 },
      },
      { op: 'imm', n: 0.5 },
    ],
    [
      {
        op: '-',
        a: {
          op: '+',
          a: { op: 'imm', n: 1 },
          b: { op: 'imm', n: 2 },
        },
        b: { op: 'imm', n: 3 },
      },
      { op: 'imm', n: 0 },
    ],
    [
      { op: 'arg', n: 0 },
      { op: 'arg', n: 0 },
    ],
    [
      {
        op: '*',
        a: { op: 'arg', n: 0 },
        b: { op: 'imm', n: 1 },
      },
      {
        op: '*',
        a: { op: 'arg', n: 0 },
        b: { op: 'imm', n: 1 },
      },
    ],
    [
      {
        op: '*',
        a: { op: 'arg', n: 0 },
        b: { op: 'arg', n: 1 },
      },
      {
        op: '*',
        a: { op: 'arg', n: 0 },
        b: { op: 'arg', n: 1 },
      },
    ],
    [
      {
        op: '-',
        a: {
          op: '+',
          a: {
            op: '+',
            a: { op: 'imm', n: 1 },
            b: { op: 'imm', n: 2 },
          },
          b: { op: 'imm', n: 3 },
        },
        b: { op: 'arg', n: 0 },
      },
      {
        op: '-',
        a: { op: 'imm', n: 6 },
        b: { op: 'arg', n: 0 },
      },
    ],
    [
      {
        op: '/',
        a: {
          op: '-',
          a: {
            op: '+',
            a: {
              op: '*',
              a: { op: '*', a: { op: 'imm', n: 2 }, b: { op: 'imm', n: 3 } },
              b: { op: 'arg', n: 0 },
            },
            b: { op: '*', a: { op: 'imm', n: 5 }, b: { op: 'arg', n: 1 } },
          },
          b: { op: '*', a: { op: 'imm', n: 3 }, b: { op: 'arg', n: 2 } },
        },
        b: {
          op: '+',
          a: { op: '+', a: { op: 'imm', n: 1 }, b: { op: 'imm', n: 3 } },
          b: { op: '*', a: { op: 'imm', n: 2 }, b: { op: 'imm', n: 2 } },
        },
      },
      {
        op: '/',
        a: {
          op: '-',
          a: {
            op: '+',
            a: { op: '*', a: { op: 'imm', n: 6 }, b: { op: 'arg', n: 0 } },
            b: { op: '*', a: { op: 'imm', n: 5 }, b: { op: 'arg', n: 1 } },
          },
          b: { op: '*', a: { op: 'imm', n: 3 }, b: { op: 'arg', n: 2 } },
        },
        b: { op: 'imm', n: 8 },
      },
    ],
  ])('should optimize: %s', (ast, expected) => {
    expect(JSON.stringify(new Optimizer().optimize(ast))).toBe(
      JSON.stringify(expected)
    );
  });
});
