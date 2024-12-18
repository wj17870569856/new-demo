/**
 * floatObj 包含加减乘除四个方法，能确保浮点数运算不丢失精度
 *
 * method：add / subtract / multiply /divide
 *
 */

function isInteger(obj) {
  return Math.floor(obj) === obj;
}

function toInteger(floatNum) {
  var ret = {
    times: 1,
    num: 0,
  };
  var isNegative = floatNum < 0;
  if (isInteger(floatNum)) {
    ret.num = floatNum;
    return ret;
  }
  var strfi = floatNum + "";
  var dotPos = strfi.indexOf(".");
  var len = strfi.substr(dotPos + 1).length;
  var times = Math.pow(10, len);
  var intNum = parseInt(Math.abs(floatNum) * times + 0.5, 10);
  ret.times = times;
  if (isNegative) {
    intNum = -intNum;
  }
  ret.num = intNum;
  return ret;
}

function operation(a, b, digits, op) {
  var o1 = toInteger(a);
  var o2 = toInteger(b);
  var n1 = o1.num;
  var n2 = o2.num;
  var t1 = o1.times;
  var t2 = o2.times;
  var max = t1 > t2 ? t1 : t2;
  var result = null;
  switch (op) {
    case "add": //加
      if (t1 === t2) {
        // 两个小数位数相同
        result = n1 + n2;
      } else if (t1 > t2) {
        // o1 小数位 大于 o2
        result = n1 + n2 * (t1 / t2);
      } else {
        // o1 小数位 小于 o2
        result = n1 * (t2 / t1) + n2;
      }
      return result / max;
    case "subtract": //减
      if (t1 === t2) {
        result = n1 - n2;
      } else if (t1 > t2) {
        result = n1 - n2 * (t1 / t2);
      } else {
        result = n1 * (t2 / t1) - n2;
      }
      return result / max;
    case "multiply": //乘
      result = (n1 * n2) / (t1 * t2);
      return result;
    case "divide": //除
      result = (n1 / n2) * (t2 / t1);
      return result;
  }
}

var methods = {
  // 加减乘除的四个接口
  add(a, b, digits) {
    return operation(a, b, digits, "add");
  },

  subtract(a, b, digits) {
    return operation(a, b, digits, "subtract");
  },

  multiply(a, b, digits) {
    return operation(a, b, digits, "multiply");
  },

  divide(a, b, digits) {
    return operation(a, b, digits, "divide");
  },
};

export default {
  performOperation: (type, num1, num2, digits) => {
    return methods[type](num1, num2, digits);
  },
  timeAgo(time, originTime) {
    if (!time) return "";
    let stamp = 0;
    stamp = new Date(time).getTime() - new Date().getTime();
    // 30天以内，返回“多久前”
    if (stamp >= 1000 * 60 * 60 * 24) {
      return ((stamp / 1000 / 60 / 60 / 24) | 0) + "天";
    } else if (stamp >= 1000 * 60 * 60) {
      return ((stamp / 1000 / 60 / 60) | 0) + "小时";
    } else if (stamp >= 1000 * 60 * 3) {
      // 3分钟以内为：刚刚
      return ((stamp / 1000 / 60) | 0) + "分钟";
    } else {
      return 0;
    }
  },
};
