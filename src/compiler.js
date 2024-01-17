const { Tokenizer } = require('./tokenizer');
const { Parser } = require('./parser');
const { Optimizer } = require('./optimizer');
const { CodeGenerator } = require('./code-generator');

class Compiler {
  compile(program) {
    return this.pass3(this.pass2(this.pass1(program)));
  }

  pass1(program) {
    const parser = new Parser(new Tokenizer(program));

    return parser.parse();
  }

  pass2(ast) {
    return new Optimizer().optimize(ast);
  }

  pass3(ast) {
    return new CodeGenerator().generate(ast);
  }
}

module.exports = { Compiler };
