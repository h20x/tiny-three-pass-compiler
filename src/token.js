const TokenType = {
  EOF: 'EOF',
  VAR: 'VAR',
  NUM: 'NUM',
  MINUS: 'MINUS',
  PLUS: 'PLUS',
  MUL: 'MUL',
  DIV: 'DIV',
  LPAR: 'LPAR',
  RPAR: 'RPAR',
  LSB: 'LSB',
  RSB: 'RSB',
};

class Token {
  constructor(type, value = null) {
    this._type = type;
    this._value = value;
  }

  getType() {
    return this._type;
  }

  getValue() {
    return this._value;
  }
}

module.exports = { Token, TokenType };
