const { TokenType } = require('./token');

class Parser {
  constructor(tokenizer) {
    this._args = [];
    this._currentToken = tokenizer.nextToken();
    this._tokenizer = tokenizer;
  }

  parse() {
    if (this._currentToken.hasType(TokenType.EOF)) {
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

    while (!this._currentToken.hasType(TokenType.RSB)) {
      this._args.push(this._currentToken.getValue());
      this._advance();
    }

    this._advance();
  }

  _parseExpr() {
    let result = this._term();

    while (this._currentToken.hasType([TokenType.PLUS, TokenType.MINUS])) {
      const op = this._currentToken.getValue();
      this._advance();
      result = { op, a: result, b: this._term() };
    }

    return result;
  }

  _term() {
    let result = this._factor();

    while (this._currentToken.hasType([TokenType.MUL, TokenType.DIV])) {
      const op = this._currentToken.getValue();
      this._advance();
      result = { op, a: result, b: this._factor() };
    }

    return result;
  }

  _factor() {
    if (this._currentToken.hasType(TokenType.NUM)) {
      return this._parseNum();
    }

    if (this._currentToken.hasType(TokenType.VAR)) {
      return this._parseVar();
    }

    if (this._currentToken.hasType(TokenType.LPAR)) {
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
