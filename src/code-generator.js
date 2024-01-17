const INSTRUCTIONS = {
  '+': 'AD',
  '-': 'SU',
  '*': 'MU',
  '/': 'DI',
  imm: 'IM',
  arg: 'AR',
};

class CodeGenerator {
  generate(ast) {
    if ('imm' === ast.op || 'arg' === ast.op) {
      return [`${INSTRUCTIONS[ast.op]} ${ast.n}`];
    }

    return [
      ...this.generate(ast.a),
      'PU',
      ...this.generate(ast.b),
      'SW',
      'PO',
      INSTRUCTIONS[ast.op],
    ];
  }
}

module.exports = { CodeGenerator };
