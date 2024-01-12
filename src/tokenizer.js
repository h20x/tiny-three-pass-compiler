const { Token, TokenType } = require('./token');

const SINGLE_CHAR_TOKENS = {
  '+': TokenType.PLUS,
  '-': TokenType.MINUS,
  '*': TokenType.MUL,
  '/': TokenType.DIV,
  '(': TokenType.LPAR,
  ')': TokenType.RPAR,
  '[': TokenType.LSB,
  ']': TokenType.RSB,
};

class Tokenizer {
  constructor(program) {
    this._pos = 0;
    this._program = program;
  }

  nextToken() {
    this._skipWhiteSpace();
    const char = this._currentChar();

    if ('' === char) {
      return new Token(TokenType.EOF);
    }

    if (isDigit(char)) {
      return new Token(TokenType.NUM, this._extractNum());
    }

    if (isLetter(char)) {
      return new Token(TokenType.VAR, this._extractVar());
    }

    const tokenType = SINGLE_CHAR_TOKENS[char];

    if (null != tokenType) {
      this._advance();

      return new Token(tokenType, char);
    }

    throw new Error('Unexpected character');
  }

  _skipWhiteSpace() {
    while (' ' === this._currentChar()) {
      this._advance();
    }
  }

  _currentChar() {
    return this._pos < this._program.length ? this._program[this._pos] : '';
  }

  _advance() {
    this._pos++;
  }

  _extractNum() {
    let num = '';

    while (isDigit(this._currentChar())) {
      num += this._currentChar();
      this._advance();
    }

    return Number(num);
  }

  _extractVar() {
    let name = '';

    while (isLetter(this._currentChar())) {
      name += this._currentChar();
      this._advance();
    }

    return name;
  }
}

function isDigit(ch) {
  return /[0-9]/.test(ch);
}

function isLetter(ch) {
  return /[a-zA-Z]/.test(ch);
}

module.exports = { Tokenizer };
