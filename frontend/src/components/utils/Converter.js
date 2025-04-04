import dayjs from "dayjs";

export const convertDay = (day) => {
    return dayjs(day).format("DD/MM/YYYY");
  }
  
export const convertMoney = (number) => {
    if (!number && number !== 0) return '';
    
    const num = Number(number);
    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    
    if (absNum >= 1000000000) {
      return sign + '$' + (absNum / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    
    if (absNum >= 1000000) {
      return sign + '$' + (absNum / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    
    if (absNum >= 1000) {
      return sign + '$' + (absNum / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    
    return sign + '$' + absNum.toString();
  }