import {
    BinaryOperator,
    BracketsOperator,
    DivOperator,
    MulOperator,
    SubOperator,
    SumOperator
} from "./expression.mjs";

/**
 * Парсер математических выражений калькулятора.
 */
class Parser {

    /**
     * Разбирает строку и возвращает дерево выражений.
     * @param expressionString строка для разбора
     * @returns дерево выражений
     */
    parse(expressionString) {
        const operatorSymbols = ['+', '-', '*', '/', ')']
        let operandStr = []
        let tokens = []
        let operators = []
        for (let i = 0; i < expressionString.length; ++i) {
            const ch = expressionString[i]
            if (ch === ' ') {
                continue
            }
            if (ch === '(') {
                const lastIdx = this._findClosingBracketIndex(expressionString, i + 1)
                const bracketsContent = expressionString.substring(i + 1, lastIdx)
                i = lastIdx
                tokens.push(this._parseBrackets(bracketsContent))
                continue
            }
            if (operatorSymbols.includes(ch)) {
                if (operandStr.length > 0) {
                    tokens.push(Number(operandStr.join('')))
                    operandStr = []
                }
            } else {
                operandStr.push(ch)
            }
            if (i === (expressionString.length - 1)) {
                if (operandStr.length > 0) {
                    tokens.push(Number(operandStr.join('')))
                    operandStr = []
                }
            }
            if (ch === '+') {
                const op = new SumOperator()
                tokens.push(op)
                operators.push(op)
            }
            if (ch === '-') {
                const op = new SubOperator()
                tokens.push(op)
                operators.push(op)
            }
            if (ch === '*') {
                const op = new MulOperator()
                tokens.push(op)
                operators.push(op)
            }
            if (ch === '/') {
                const op = new DivOperator()
                tokens.push(op)
                operators.push(op)
            }
        }

        operators.sort((op1, op2) => op2.priority - op1.priority);
        for (const operator of operators) {
            let idx = tokens.indexOf(operator);
            if (operator instanceof BinaryOperator) {
                operator.leftOperand = tokens[idx - 1]
                operator.rightOperand = tokens[idx + 1]
                tokens.splice(idx - 1, 3, operator)
            }
        }
        return tokens[0]
    }

    /**
     * Выполняет разбор строки выражения-скобки.
     * @param bracketsContent строка выражения-скобрки
     * @returns {BracketsOperator} выражение-скобки
     */
    _parseBrackets(bracketsContent) {
        const operand = this.parse(bracketsContent);
        return new BracketsOperator(operand);
    }

    /**
     * Выполняет поиск закрывающей скобки. Возвращает индекс закрывающей скобки.
     * Учитывается, что могут быть также вложенные выражения в скобках.
     * @param expression строка для поиска
     * @param startIndex начальный индекс для поиска
     * @returns индекс символа закрывающей скобки
     * @private
     */
    _findClosingBracketIndex(expression, startIndex) {
        let passCount = 0
        let result
        for (let i = startIndex; i < expression.length; ++i) {
            const ch = expression[i]
            if (ch === '(') {
                ++passCount
            }
            if (ch === ')') {
                if (passCount > 0) {
                    --passCount
                } else {
                    result = i
                    break;
                }
            }
        }
        if (result === undefined) {
            throw new Error("Не найдена закрывающая скобка")
        }
        return result
    }

}

export {Parser}


console.log('============== Testing parser: ==============')
let p = new Parser()

let inputStrings = [
    '1+2*3',
    '(1+2)*3',
    '(1+2)*(3+4)',
    '((1+2)*3)+(4-(3-1))',
    '(3)+2*8',
    '3+2*8)',
    '3+2)*8',
    '2e1*2',
    '-1'
]

for (const str of inputStrings) {
    let expr = p.parse(str)
    console.log(`input: ${str}; result expression: ${expr.toString()} = ${expr.calculate()}`)
}
