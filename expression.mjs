const sumPriority = 5;
const subPriority = 5;
const mulPriority = 6;
const divPriority = 6;
const bracketsPriority = 15;

/**
 * Выражение.
 */
class Expression {

    /** Приоритет выражения */
    priority

    constructor(aPriority) {
        this.priority = aPriority
    }

    /**
     * Вычисляет выражение
     * @returns {number}
     */
    calculate() {
        return undefined
    }
}

/**
 * Унарный оператор.
 */
class UnaryOperator extends Expression {

    /** Операнд */
    operand

    constructor(aPriority, aOperand) {
        super(aPriority);
        this.operand = aOperand
    }

}

/**
 * Оператор - скобки.
 */
class BracketsOperator extends UnaryOperator {

    /** Операнд */
    operand

    constructor(aOperand) {
        super(bracketsPriority);
        this.operand = aOperand
    }

    calculate() {
        return (this.operand instanceof Expression) ? this.operand.calculate() : this.operand
    }

    toString() {
        return `(${this.operand.toString()})`
    }

}

/**
 * Бинарный оператор.
 */
class BinaryOperator extends Expression {

    /** Левый операнд */
    leftOperand

    /** Правый операнд */
    rightOperand

    constructor(aPriority, aLeftOperand, aRightOperand) {
        super(aPriority);
        this.leftOperand = aLeftOperand
        this.rightOperand = aRightOperand
    }

    toString() {
        let left = this.leftOperand?.toString()
        if (this.priority >= this.leftOperand?.priority) {
            left = `(${left})`
        }
        let right = this.rightOperand.toString()
        if (this.priority >= this.rightOperand.priority) {
            right = `(${right})`
        }
        return `${left} ${this._getOperatorSymbol()} ${right}`
    }

    /**
     * Вычисляет левый операнд.
     *
     * @returns {number}
     * @@protected
     */
    _calculateLeftOperand() {
        return (this.leftOperand instanceof Expression) ? this.leftOperand.calculate() : (this.leftOperand ?? 0)
    }

    /**
     * Вычисляет правый операнд.
     *
     * @returns {number}
     * @protected
     */
    _calculateRightOperand() {
        return (this.rightOperand instanceof Expression) ? this.rightOperand.calculate() : this.rightOperand
    }

    /**
     * Возвращает символ оператора.
     *
     * @returns {string}
     * @protected
     */
    _getOperatorSymbol() {
        return undefined
    }

}

/**
 * Оператор суммирования.
 */
class SumOperator extends BinaryOperator {

    constructor(aLeftOperand, aRightOperand) {
        super(sumPriority, aLeftOperand, aRightOperand);
    }

    calculate() {
        return this._calculateLeftOperand() + this._calculateRightOperand();
    }

    _getOperatorSymbol() {
        return '+'
    }

}

/**
 * Оператор вычитания.
 */
class SubOperator extends BinaryOperator {

    constructor(aLeftOperand, aRightOperand) {
        super(subPriority, aLeftOperand, aRightOperand);
    }

    calculate() {
        return this._calculateLeftOperand() - this._calculateRightOperand();
    }

    _getOperatorSymbol() {
        return '-'
    }

}

/**
 * Оператор умножения.
 */
class MulOperator extends BinaryOperator {

    constructor(aLeftOperand, aRightOperand) {
        super(mulPriority, aLeftOperand, aRightOperand);
    }

    calculate() {
        return this._calculateLeftOperand() * this._calculateRightOperand();
    }

    _getOperatorSymbol() {
        return '*'
    }

}

/**
 * Оператор умножения.
 */
class DivOperator extends BinaryOperator {

    constructor(aLeftOperand, aRightOperand) {
        super(divPriority, aLeftOperand, aRightOperand);
    }

    calculate() {
        return this._calculateLeftOperand() * this._calculateRightOperand();
    }

    _getOperatorSymbol() {
        return '/'
    }

}

export {
    Expression,
    UnaryOperator,
    BinaryOperator,
    BracketsOperator,
    SumOperator,
    SubOperator,
    MulOperator,
    DivOperator
}

let sum = new SumOperator(1, 2)
let sub = new SubOperator(5, 2)
let mul = new MulOperator(sum, sub)

console.log(mul.toString())
console.log(mul.calculate())