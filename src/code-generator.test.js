const { CodeGenerator } = require('./code-generator');

describe('CodeGenerator', () => {
  test.each([
    [{ op: 'imm', n: 0 }, [{ args: [], result: 0 }]],
    [{ op: 'arg', n: 0 }, [{ args: [1], result: 1 }]],
    [
      { op: '+', a: { op: 'imm', n: 1 }, b: { op: 'imm', n: 2 } },
      [{ args: [], result: 3 }],
    ],
    [
      { op: '-', a: { op: 'imm', n: 1 }, b: { op: 'imm', n: 2 } },
      [{ args: [], result: -1 }],
    ],
    [
      { op: '*', a: { op: 'imm', n: 2 }, b: { op: 'imm', n: 2 } },
      [{ args: [], result: 4 }],
    ],
    [
      { op: '/', a: { op: 'imm', n: 1 }, b: { op: 'imm', n: 2 } },
      [{ args: [], result: 0.5 }],
    ],
    [
      { op: '+', a: { op: 'arg', n: 0 }, b: { op: 'arg', n: 1 } },
      [{ args: [4, 8], result: 12 }],
    ],
    [
      {
        op: '-',
        a: {
          op: '+',
          a: { op: 'imm', n: 1 },
          b: { op: 'imm', n: 2 },
        },
        b: {
          op: '+',
          a: { op: 'imm', n: 1 },
          b: { op: 'imm', n: 2 },
        },
      },
      [{ args: [], result: 0 }],
    ],
    [
      {
        op: '+',
        a: {
          op: '+',
          a: { op: 'imm', n: 1 },
          b: { op: 'imm', n: 3 },
        },
        b: {
          op: '*',
          a: { op: 'imm', n: 2 },
          b: { op: 'imm', n: 2 },
        },
      },
      [{ args: [], result: 8 }],
    ],
    [
      {
        op: '-',
        a: {
          op: '+',
          a: {
            op: '*',
            a: {
              op: '*',
              a: { op: 'imm', n: 2 },
              b: { op: 'imm', n: 3 },
            },
            b: { op: 'arg', n: 0 },
          },
          b: {
            op: '*',
            a: { op: 'imm', n: 5 },
            b: { op: 'arg', n: 1 },
          },
        },
        b: {
          op: '*',
          a: { op: 'imm', n: 3 },
          b: { op: 'arg', n: 2 },
        },
      },
      [
        { args: [4, 0, 0], result: 24 },
        { args: [4, 8, 0], result: 64 },
        { args: [4, 8, 16], result: 16 },
      ],
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
      [
        { args: [4, 0, 0], result: 3 },
        { args: [4, 8, 0], result: 8 },
        { args: [4, 8, 16], result: 2 },
      ],
    ],
  ])('should generate instructions: %j, %j', (ast, data) => {
    const instructions = new CodeGenerator().generate(ast);

    data.forEach(({ args, result }) => {
      expect(simulate(instructions, args)).toBe(result);
    });
  });
});

function simulate(asm, args) {
  let r0;
  let r1;
  let stack = [];

  asm.forEach((instruct) => {
    let match = instruct.match(/(IM|AR)\s+(\d+)/) || [0, instruct, 0];
    let ins = match[1];
    let n = match[2] | 0;

    if ('IM' === ins) r0 = n;
    else if ('AR' === ins) r0 = args[n];
    else if ('SW' === ins) [r0, r1] = [r1, r0];
    else if ('PU' === ins) stack.push(r0);
    else if ('PO' === ins) r0 = stack.pop();
    else if ('AD' === ins) r0 += r1;
    else if ('SU' === ins) r0 -= r1;
    else if ('MU' === ins) r0 *= r1;
    else if ('DI' === ins) r0 /= r1;
  });

  return r0;
}
