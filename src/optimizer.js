class Optimizer {
  optimize(ast) {
    return this._optimizeNode(ast);
  }

  _optimizeNode(node) {
    if ('arg' === node.op || 'imm' === node.op) {
      return node;
    }

    return this._optimizeBinaryOp(node);
  }

  _optimizeBinaryOp(node) {
    const { op } = node;
    const a = this._optimizeNode(node.a);
    const b = this._optimizeNode(node.b);

    if ('imm' === a.op && 'imm' === b.op) {
      return { op: 'imm', n: this._calc(op, a, b) };
    }

    return { op, a, b };
  }

  _calc(op, a, b) {
    switch (op) {
      case '+':
        return a.n + b.n;
      case '-':
        return a.n - b.n;
      case '*':
        return a.n * b.n;
      case '/':
        return a.n / b.n;
    }
  }
}

module.exports = { Optimizer };
