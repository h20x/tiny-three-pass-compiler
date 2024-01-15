const { TokenType } = require('./token');

class Parser {
  constructor(tokenizer) {
    this._args = [];
    this._currentToken = tokenizer.nextToken();
    this._tokenizer = tokenizer;
  }

  parse() {
    if (TokenType.EOF === this._currentToken.getType()) {
      return null;
    }

    this._parseArgs();

    return this._parseExpr();
  }

  _advance() {
    this._currentToken = this._tokenizer.nextToken();
  }

  _parseArgs() {
    this._advance();

    while (TokenType.RSB !== this._currentToken.getType()) {
      this._args.push(this._currentToken.getValue());
      this._advance();
    }

    this._advance();
  }

  _parseExpr() {
    let result = this._term();

    while (
      TokenType.PLUS === this._currentToken.getType() ||
      TokenType.MINUS === this._currentToken.getType()
    ) {
      const op = this._currentToken.getValue();
      this._advance();
      result = { op, a: result, b: this._term() };
    }

    return result;
  }

  _term() {
    let result = this._factor();

    while (
      TokenType.MUL === this._currentToken.getType() ||
      TokenType.DIV === this._currentToken.getType()
    ) {
      const op = this._currentToken.getValue();
      this._advance();
      result = { op, a: result, b: this._factor() };
    }

    return result;
  }

  _factor() {
    if (TokenType.NUM === this._currentToken.getType()) {
      return this._parseNum();
    }

    if (TokenType.VAR === this._currentToken.getType()) {
      return this._parseVar();
    }

    if (TokenType.LPAR === this._currentToken.getType()) {
      return this._parseParenteses();
    }
  }

  _parseNum() {
    const n = this._currentToken.getValue();
    this._advance();

    return { op: 'imm', n };
  }

  _parseVar() {
    const name = this._currentToken.getValue();
    this._advance();

    return { op: 'arg', n: this._args.indexOf(name) };
  }

  _parseParenteses() {
    this._advance();
    const result = this._parseExpr();
    this._advance();

    return result;
  }
}

module.exports = { Parser };
