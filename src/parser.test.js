const { Tokenizer } = require('./tokenizer');
const { Parser } = require('./parser');

describe('Parser', () => {
  test.each([
    ['[] 1', { op: 'imm', n: 1 }],
    ['[] 1 + 2', { op: '+', a: { op: 'imm', n: 1 }, b: { op: 'imm', n: 2 } }],
    ['[] 1 - 2', { op: '-', a: { op: 'imm', n: 1 }, b: { op: 'imm', n: 2 } }],
    [
      '[] 1 + 2 - 3',
      {
        op: '-',
        a: {
          op: '+',
          a: { op: 'imm', n: 1 },
          b: { op: 'imm', n: 2 },
        },
        b: { op: 'imm', n: 3 },
      },
    ],
    ['[] 1 * 2', { op: '*', a: { op: 'imm', n: 1 }, b: { op: 'imm', n: 2 } }],
    ['[] 1 / 2', { op: '/', a: { op: 'imm', n: 1 }, b: { op: 'imm', n: 2 } }],
    [
      '[] 1 * 2 / 3',
      {
        op: '/',
        a: {
          op: '*',
          a: { op: 'imm', n: 1 },
          b: { op: 'imm', n: 2 },
        },
        b: { op: 'imm', n: 3 },
      },
    ],
    [
      '[] 1 * 2 / 3 + 4',
      {
        op: '+',
        a: {
          op: '/',
          a: {
            op: '*',
            a: { op: 'imm', n: 1 },
            b: { op: 'imm', n: 2 },
          },
          b: { op: 'imm', n: 3 },
        },
        b: { op: 'imm', n: 4 },
      },
    ],
    [
      '[] 1 + 2 * 3 / 4',
      {
        op: '+',
        a: {
          op: 'imm',
          n: 1,
        },
        b: {
          op: '/',
          a: {
            op: '*',
            a: { op: 'imm', n: 2 },
            b: { op: 'imm', n: 3 },
          },
          b: { op: 'imm', n: 4 },
        },
      },
    ],
    [
      '[] 1 + 2 * 3 - 4 / 5',
      {
        op: '-',
        a: {
          op: '+',
          a: { op: 'imm', n: 1 },
          b: {
            op: '*',
            a: { op: 'imm', n: 2 },
            b: { op: 'imm', n: 3 },
          },
        },
        b: {
          op: '/',
          a: { op: 'imm', n: 4 },
          b: { op: 'imm', n: 5 },
        },
      },
    ],
    [
      '[] (1 + 2)',
      {
        op: '+',
        a: { op: 'imm', n: 1 },
        b: { op: 'imm', n: 2 },
      },
    ],
    [
      '[] ((1 + 2))',
      {
        op: '+',
        a: { op: 'imm', n: 1 },
        b: { op: 'imm', n: 2 },
      },
    ],
    [
      '[] 1 + (2 - 3)',
      {
        op: '+',
        a: { op: 'imm', n: 1 },
        b: {
          op: '-',
          a: { op: 'imm', n: 2 },
          b: { op: 'imm', n: 3 },
        },
      },
    ],
    [
      '[] ((1 + 2) * (3 - 4)) + 5',
      {
        op: '+',
        a: {
          op: '*',
          a: {
            op: '+',
            a: { op: 'imm', n: 1 },
            b: { op: 'imm', n: 2 },
          },
          b: {
            op: '-',
            a: { op: 'imm', n: 3 },
            b: { op: 'imm', n: 4 },
          },
        },
        b: { op: 'imm', n: 5 },
      },
    ],
    [
      '[x] x + 1',
      {
        op: '+',
        a: { op: 'arg', n: 0 },
        b: { op: 'imm', n: 1 },
      },
    ],
    [
      '[ x y z ] ( 2 * 3 * x + 5 * y - 3 * z ) / (1 + 3 + 2 * 2)',
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
    ],
  ])('should parse: %s', (program, expected) => {
    const parser = new Parser(new Tokenizer(program));
    expect(JSON.stringify(parser.parse())).toBe(JSON.stringify(expected));
  });
});
