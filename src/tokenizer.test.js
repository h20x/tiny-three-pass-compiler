const { Tokenizer } = require('./tokenizer');
const { TokenType: TT } = require('./token');

describe('Tokenizer', () => {
  test.each([
    ['', [TT.EOF]],
    [' ', [TT.EOF]],
    ['+', [TT.PLUS]],
    ['-', [TT.MINUS]],
    ['*', [TT.MUL]],
    ['/', [TT.DIV]],
    ['(', [TT.LPAR]],
    [')', [TT.RPAR]],
    ['[', [TT.LSB]],
    [']', [TT.RSB]],
    ['1', [TT.NUM]],
    ['99', [TT.NUM]],
    ['x', [TT.VAR]],
    ['sum', [TT.VAR]],
    [
      '[ a b ] a*a + b*b',
      [
        TT.LSB,
        TT.VAR,
        TT.VAR,
        TT.RSB,
        TT.VAR,
        TT.MUL,
        TT.VAR,
        TT.PLUS,
        TT.VAR,
        TT.MUL,
        TT.VAR,
      ],
    ],
    [
      '[ first second ] (first + second) / 2',
      [
        TT.LSB,
        TT.VAR,
        TT.VAR,
        TT.RSB,
        TT.LPAR,
        TT.VAR,
        TT.PLUS,
        TT.VAR,
        TT.RPAR,
        TT.DIV,
        TT.NUM,
      ],
    ],
    [
      '[ x y z ] ( 2*3*x + 5*y - 3*z ) / (1 + 3 + 2*2)',
      [
        TT.LSB,
        TT.VAR,
        TT.VAR,
        TT.VAR,
        TT.RSB,
        TT.LPAR,
        TT.NUM,
        TT.MUL,
        TT.NUM,
        TT.MUL,
        TT.VAR,
        TT.PLUS,
        TT.NUM,
        TT.MUL,
        TT.VAR,
        TT.MINUS,
        TT.NUM,
        TT.MUL,
        TT.VAR,
        TT.RPAR,
        TT.DIV,
        TT.LPAR,
        TT.NUM,
        TT.PLUS,
        TT.NUM,
        TT.PLUS,
        TT.NUM,
        TT.MUL,
        TT.NUM,
        TT.RPAR,
      ],
    ],
  ])('should tokenize: %s', (program, expectedTokens) => {
    const tokenizer = new Tokenizer(program);

    expectedTokens.forEach((type) => {
      expect(tokenizer.nextToken().getType()).toBe(type);
    });

    expect(tokenizer.nextToken().getType()).toBe(TT.EOF);
  });
});
