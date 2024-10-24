function getRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// 洗牌函数
export function shuffle(arr){
    for(let i = 0;i<arr.length; i++){
      const j = getRandomNumber(0, i);
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
}
// 罗澜返回的UTC时间转北京时间（new Date格式）
export function UTCtransform(utcString){
  let UTCTime = new Date(utcString+'Z');
  return new Date(UTCTime.setHours(UTCTime.getUTCHours()+ 8));
}

export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}

// 金额格式化
export function toThousands(num) {
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

// 创建单例模式
export function singleton(className){
  let ins;
   const proxy = new Proxy(className,{
    construct(target, args) {
      if(!ins){
        ins = new target(...args);
      }
      return ins;
    }
   });
   className.prototype.constructor = proxy;
   return proxy;
}
