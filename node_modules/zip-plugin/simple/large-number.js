// 测试重复引入是否删除
import getStrNumber from './getStrNumber.js';

/** 
 * @name add
 * @description
 * 计算两个整数字符串相加
 * @param { string } a 整数字符串a
 * @param { string } b 整数字符串b
 * @return { string }
 */
export default function add(a, b) {
  let i = a.length - 1;
  let j = b.length - 1;
  let carry = 0;
  let ret = '';

  while (i >= 0 || j >= 0) {
    let x = 0;
    let y = 0;
    let sum;

    if (i >= 0) {
      x = a[i] - '0';
      i--;
    }

    if (j >= 0) {
      y = b[j] - '0';
      j--;
    }

    sum = x + y + carry;

    if (sum >= 10) {
      carry = 1;
      sum -= 10;
    } else {
      carry = 0;
    } 

    ret = sum + ret;
  }

  if (carry) {
    ret = carry + ret;
  }

  return ret;
}