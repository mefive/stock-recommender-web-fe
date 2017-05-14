/**
 * Created by wangjialin on 16/11/23.
 */
export function formatBit(num){
  var decimal = String(num).split('.')[1] || '';//小数部分
  var tempArr = [];
  var revNumArr = String(num).split('.')[0].split("").reverse();//倒序
  for (let i in revNumArr){
    tempArr.push(revNumArr[i]);
    if((i+1)%3 === 0 && i != revNumArr.length-1){
      tempArr.push(',');
    }
  }
  var zs = tempArr.reverse().join('');//整数部分
  return decimal?zs+'.'+decimal:zs;
}

export function getPercent(a, b) {
  if (b === 0) {
    return 0;
  }
  return parseInt((a / b) * 100 * 100, 10) / 100;
}

export function getRatioPercent(target, base) {
  if (base === 0) {
    return '--';
  }
  if (isNaN(+target) || isNaN(+base)) {
    return 0.00;
  }
  return (((target - base) / base) * 100).toFixed(2);
}
