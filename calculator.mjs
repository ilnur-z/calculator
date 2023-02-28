import {Parser} from "./parser.mjs";

let CalculatorEventType = {EXPRESSION_CHANGED:1, }

class Calculator {

    #expressionStr

    listeners = []

    get expressionStr() {
        return this.#expressionStr
    }

    set expressionStr(aExpressionStr) {
        this.#expressionStr = aExpressionStr;
        this.fireEvent(CalculatorEventType.EXPRESSION_CHANGED)
    }

    constructor() {
    }

    calculate() {
        let p = new Parser()
        let expr = p.parse(this.expressionStr)
        let res = expr.calculate()
        this.expressionStr = res.toString();
        this.fireEvent(CalculatorEventType.EXPRESSION_CHANGED)
    }

    clear() {
        this.expressionStr = ''
        this.fireEvent(CalculatorEventType.EXPRESSION_CHANGED)
    }

    addListener(aListener) {
        this.listeners.push(aListener)
    }

    removeListener(aListener) {
        const idx = this.listeners.indexOf(aListener)
        if (idx > -1) {
            this.listeners.splice(idx, 1)
        }
    }

    fireEvent(aCalculatorEventType) {
        this.listeners.forEach(listener=>listener(aCalculatorEventType))
    }

}

