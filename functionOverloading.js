/**
 * Create by chizi
 * 
 * Function Overloading
 * 
 * 函數重載協議：
 * 實現 <T> 的 [Symbol.functionOverloading] 靜態方法，該方法返回 param 是否為 <T> 的布林值
 * 例子（未定義類型時）：
 * class <T> {
 *  static [Symbol.functionOverloading](param) {
 *      return Bool(param is <T> ?)
 *  }
 * }
 * 例子（已有類型時）：
 * <T>[Symbol.functionOverloading] = function(param) {...}
 * 或者：
 * Object.defineProperty(<T>, [Symbol.functionOverloading], {
 *  value: function(param) {...}
 * });
 */

Object.defineProperty(Symbol, 'functionOverloading', {
    value: Symbol('Symbol.functionOverloading'),
    writable: false,
    enumerable: false,
    configurable: false
});

/* 安全方法，判斷類型是否已經存在 */
// function __safeDefineFunctionOverloadingProtocols(T, isSameType) {
//     if (typeof T === 'function') {
//         Object.defineProperty(T, [Symbol.functionOverloading], {
//             value: isSameType
//         });
//     } else {
//         globalThis[T] = isSameType;
//     }
// }
// __safeDefineFunctionOverloadingProtocols(Int, (param) => {
//     return Number.isInteger(param);
// });
// __safeDefineFunctionOverloadingProtocols(Double, (param) => {
//     return param % 1 != 0;
// });
// __safeDefineFunctionOverloadingProtocols(Number, (param) => {
//     return typeof param == 'number';
// });
// __safeDefineFunctionOverloadingProtocols(MatrixSize, (param) => {
//     return param instanceof MatrixSize;
// });

// 會取代已經定義的 class，因此此方法不安全
class Int extends Number {}
class Double extends Number {}
class MatrixSize {}
Int[Symbol.functionOverloading] = function isSameType(param) {
    return Number.isInteger(param);
}
Double[Symbol.functionOverloading] = function isSameType(param) {
    return param % 1 != 0;
}
Number[Symbol.functionOverloading] = function isSameType(param) {
    return typeof param == 'number';
}
MatrixSize[Symbol.functionOverloading] = function isSameType(param) {
    return param instanceof MatrixSize;
}
function __hasFunctionOverloadingProtocols(T) {
    return typeof T[Symbol.functionOverloading] === 'function'
}

function FunctionOverloading(...params) {
    console.log(params.length)
    let numOfParam = params.length;
    let success = false;
    function other(func) {
        if (!success) {
            func();
        }
    }
    function condition(...Ts) {
        const func = Ts.pop();
        const l = Ts.length;
        console.log(l)
        if (l <= numOfParam && Ts.every(e => __hasFunctionOverloadingProtocols(e)) && typeof func == 'function') {
            if (success) {
                return { condition, other };
            }
            for (let i = 0; i < l; i++) {
                console.log(Ts[i][Symbol.functionOverloading](params[i]))
                if (!Ts[i][Symbol.functionOverloading](params[i])) {
                    return { condition, other };
                }
            }
            func();
            success = true;
            return { condition, other };
        } else {
            throw '條件的參數錯誤';
        }
    }
    return { condition, other };
}

/**
 * using
 * 使用方法
 * 
 * condition 鏈需把參數較多的寫在參數較少的前面
 * 例子： .condition(Int, Double).condition(Int)
 */
function foo() {
    let result = 0;
    FunctionOverloading(...arguments)
    .condition(Int, Int, Double, Int, () => {
        result = 1;
    })
    .condition(Int, () => {
        result = 3;
    }).condition(Int, Int, Double, () => {
        result = 1;
    }).condition(Double, Int, () => {
        result = 2;
    }).other(() => {
        result = 4;
    })
    return result;
}

console.log(foo(1))