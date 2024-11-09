
const mapRoles = {
  "1":"发起人",
  "2":"审批",
  "3":"送审",
  "4":"决策",
  "5":"审阅结束"
}
function pluralize(time, label) {
  if (time === 1) {
    return time + label;
  }
  return time + label + "s";
}

// 数字格式化，小数位为零不显示
export function numberFormat(value) {
  value = value || 0;

  return parseFloat(value);
}
export function filterRoles(val){
   return mapRoles[val];
}
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time);
  if (between < 3600) {
    return pluralize(~~(between / 60), " minute");
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), " hour");
  } else {
    return pluralize(~~(between / 86400), " day");
  }
}
export function filterRole(cellValue){
  const roleArray = JSON.parse(localStorage.getItem('roleList') || '[]')
  if(!cellValue) return '无职位';
  const label = roleArray.find(item => item.value === cellValue)?.label ?? '未知职位';
  return label;
}
// export function filterRank(newValue){
//   if(!newValue) return '未知段位';
//   const label = historyRank.find(item => item.value === newValue)?.label ?? '未知段位';
//   return label;
// }

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }

  if ((time + "").length === 10) {
    time = +time * 1000;
  }

  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    date = new Date(parseInt(time));
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === "a") return ["一", "二", "三", "四", "五", "六", "日"][value - 1];
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

export function formatTime(time, option) {
  time = +time * 1000;
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return d.getMonth() + 1 + "月" + d.getDate() + "日" + d.getHours() + "时" + d.getMinutes() + "分";
  }
}

/* 数字 格式化*/
export function nFormatter(num, digits) {
  const si = [
    { value: 1e18, symbol: "E" },
    { value: 1e15, symbol: "P" },
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "G" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" }
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].symbol;
    }
  }
  return num.toString();
}

export function html2Text(val) {
  const div = document.createElement("div");
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

export function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
}
// 日期处理方式
export function dateFormat(value, fmt) {
  fmt = fmt || "yyyy-MM-dd hh:mm:ss"; // 自定义日期输出格式
  function format(value, fmt) {
    const date = new Date(typeof value === "string" ? value.replace(/-/g, "/") : value);
    const o = {
      "M+": date.getMonth() + 1, // 月份
      "d+": date.getDate(), // 日
      "h+": date.getHours(), // 小时
      "m+": date.getMinutes(), // 分
      "s+": date.getSeconds(), // 秒
      "w+": date.getDay(), // 星期
      "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (const k in o) {
      if (k === "w+") {
        if (o[k] === 0) {
          fmt = fmt.replace("w", "周日");
        } else if (o[k] === 1) {
          fmt = fmt.replace("w", "周一");
        } else if (o[k] === 2) {
          fmt = fmt.replace("w", "周二");
        } else if (o[k] === 3) {
          fmt = fmt.replace("w", "周三");
        } else if (o[k] === 4) {
          fmt = fmt.replace("w", "周四");
        } else if (o[k] === 5) {
          fmt = fmt.replace("w", "周五");
        } else if (o[k] === 6) {
          fmt = fmt.replace("w", "周六");
        }
      } else if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    return fmt;
  }

  if (value) {
    value = format(value, fmt);
  }
  return value;
}

// 金钱三位一逗号，小数点保留至少两位
export function moneyFormat(value, sign, precision = 2) {
  value = value || 0;
  // precision = precision !== undefined && precision !== '' && !isNaN(precision = Math.abs(precision)) ? precision : 2;

  // let precision = 2;

  precision = precision > 4 ? 4 : precision;

  sign = sign !== undefined && sign !== "" ? sign : "¥";
  const thousand = ",";

  let negative = value < 0 ? "-" : "",
    i = parseInt((value = Math.abs(+value || 0).toFixed(precision)), 10) + "";
  let j;
  j = (j = i.length) > 3 ? j % 3 : 0;

  return (
    sign +
    negative +
    (j ? i.substr(0, j) + thousand : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) +
    (precision
      ? "." +
        Math.abs(value - i)
          .toFixed(precision)
          .slice(2)
      : "")
  );
}
/**
 * 去除html标签和空格
 */
export function removeHtml(val) {
  console.log(val, "val===");
  let str = "";
  str = val.replace(/<\/?[^>]*>/g, ""); // 去除HTML tag
  str = str.replace(/[ | ]*\n/g, "\n"); // 去除行尾空白
  // str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
  str = str.replace(/&nbsp;/gi, ""); // 去掉&nbsp;
  str = str.length > 30 ? str.substring(0, 30) + "..." : str;
  return str;
}

export function wanyuanFormat(val) {
  const str = val + "";
  let tstr = "",
    rstr = "";
  if (str.indexOf(".") !== -1) {
    const arr = str.split(".");
    tstr = arr[0];
    rstr = arr[1];
  } else {
    tstr = str;
  }
  if (tstr.length > 4) {
    const newTstr = tstr.substring(0, tstr.length - 4);
    let newRstr = tstr.substring(tstr.length - 4) + rstr;
    while (newRstr.substring(newRstr.length - 1) === "0") {
      newRstr = newRstr.substring(0, newRstr.length - 1);
    }
    if (newRstr.length > 0) {
      return newTstr + "." + newRstr;
    }
    return newTstr;
  } else {
    const newTstr = "0.";
    const arr = ["", "0", "00", "000", "0000"];
    let index = 4 - tstr.length;
    index = index === 4 ? 0 : index;
    let newRstr = arr[index] + tstr + rstr;
    while (newRstr.substring(newRstr.length - 1) === "0") {
      newRstr = newRstr.substring(0, newRstr.length - 1);
    }
    return newTstr + newRstr;
  }
}
// 数字转大写
export function toChies(amount) {
  // 形参
  // 汉字的数字
  const cnNums = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  // 基本单位
  const cnIntRadice = ["", "十", "百", "千"];
  // 对应整数部分扩展单位
  const cnIntUnits = ["", "万", "亿", "兆"];
  // 最大处理的数字
  const maxNum = 9999999999999999.99;
  // 整数部分
  let integerNum;

  // 输出的中文字符串
  let chineseStr = "";
  // 分离后用的数组，预定义
  let parts;
  if (amount === "") {
    return "";
  }
  amount = parseFloat(amount);
  if (amount >= maxNum) {
    // 超出最大处理数字
    return "";
  }
  if (amount === 0) {
    chineseStr = cnNums[0];
    return chineseStr;
  }
  // 转换为字符串
  amount = amount.toString();
  if (amount.indexOf(".") === -1) {
    integerNum = amount;
  } else {
    parts = amount.split(".");
    integerNum = parts[0];
  }
  // 获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0;
    const IntLen = integerNum.length;
    for (let i = 0; i < IntLen; i++) {
      const n = integerNum.substr(i, 1);
      const p = IntLen - i - 1;
      const q = p / 4;
      const m = p % 4;
      if (n === "0") {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        // 归零
        zeroCount = 0;
        // alert(cnNums[parseInt(n)])
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
  }

  if (chineseStr === "") {
    chineseStr += cnNums[0];
  }
  return chineseStr;
}

export function fileSizeChange(limit) {
  if (parseFloat(limit).toString() === "NaN") {
    return "";
  }

  let size = "";
  if (limit < 0.1 * 1024) {
    // 小于0.1KB，则转化成B
    size = limit.toFixed(2) + "B";
  } else if (limit < 0.1 * 1024 * 1024) {
    // 小于0.1MB，则转化成KB
    size = (limit / 1024).toFixed(2) + "KB";
  } else if (limit < 0.1 * 1024 * 1024 * 1024) {
    // 小于0.1GB，则转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + "MB";
  } else {
    // 其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }

  const sizeStr = size + ""; // 转成字符串
  const index = sizeStr.indexOf("."); // 获取小数点处的索引
  const dou = sizeStr.substring(index + 1, 2); // 获取小数点后两位的值
  if (dou == "00") {
    // 判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substring(index + 3, 2);
  }
  return size;
}
// 计算天数差
export function dayFormatter(time, currentTime) {
  // let timeFormatter = dateFormat(time, 'yyyy-MM-dd hh:mm:ss')
  // let currentTimeFormatter = dateFormat(currentTime, 'yyyy-MM-dd hh:mm:ss')
  const timeStamp = Date.parse(new Date(time));
  const currentTimeStamp = Date.parse(new Date(currentTime));
  const dataNum = Math.abs(parseInt((currentTimeStamp - timeStamp) / 1000 / 3600 / 24));
  if (dataNum === 0) {
    return "当天";
  } else if (isNaN(dataNum)) {
    return "";
  } else {
    return dataNum + "天";
  }
}

export function convertMoney(money) {
  const cnNums = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  // 基本单位
  const cnIntRadices = ["", "拾", "佰", "仟"];
  // 扩展单位
  const cnIntUnits = ["", "万", "亿"];
  // 小数单位
  const cnDecUnits = ["角", "分"];

  const cnInteger = "整";
  const cnIntLast = "元";

  // 最大处理的数字
  const maxNum = 999999999999999.99;
  // 金额整数部分
  let integerNum;
  // 金额小数部分
  let decimalNum;

  let chineseStr = "";
  let parts;
  if (money === "") return "";
  money = parseFloat(money);
  if (money >= maxNum) return "";
  if (money === 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }

  money = money.toString();
  if (money.indexOf(".") === -1) {
    integerNum = money;
    decimalNum = "";
  } else {
    parts = money.split(".");
    integerNum = parts[0];
    decimalNum = parts[1];
  }

  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0;
    const IntLen = integerNum.length;
    for (let i = 0; i < IntLen; i++) {
      let n = integerNum[i];
      let p = IntLen - i - 1;
      let q = p / 4;
      let m = p % 4;
      if (n === "0") {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadices[m];
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }

  if (decimalNum !== "") {
    const DecLen = decimalNum.length;
    for (let i = 0; i < DecLen; i++) {
      let n = decimalNum[i];
      if (n !== "0") {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }

  if (chineseStr === "") {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum === "") {
    chineseStr += cnInteger;
  }

  return chineseStr;
}

export function dayFormat(value) {
  if (!value) return value;
  const date = new Date(value);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDay();
  return year + '年' + month + '月' + day + '日'
}

export function getTodayString(){
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  return year + '-' + month + '-' + day;
}