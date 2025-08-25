/**
 * 基于Suncalc的太阳时计算模块
 * 使用Suncalc库计算真太阳时
 */

import SunCalc from 'suncalc';

/**
 * 使用Suncalc计算真太阳时
 * @param {Date} date - 当地时间
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @returns {Object} 包含真太阳时和相关信息的对象
 */
export function calculateSolarTimeWithSuncalc(date, lat, lng) {
  try {
    // 验证输入参数
    if (!date || isNaN(date.getTime())) {
      throw new Error('Invalid date provided');
    }
    
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      throw new Error('Invalid coordinates provided');
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new Error('Coordinates out of valid range');
    }

    // 获取太阳位置信息
    const sunPosition = SunCalc.getPosition(date, lat, lng);
    const sunTimes = SunCalc.getTimes(date, lat, lng);
    
    // 计算太阳时角 (太阳的时角，以弧度为单位)
    const solarHourAngle = sunPosition.azimuth;
    
    // 计算时差修正 (单位：分钟)
    // 使用太阳的时角来计算时间偏移
    const timeCorrection = calculateTimeCorrection(date, lat, lng, sunPosition);
    
    // 应用时间修正
    const solarTime = new Date(date.getTime() + timeCorrection * 60 * 1000);
    
    return {
      originalTime: new Date(date),
      solarTime: solarTime,
      timeCorrection: timeCorrection, // 分钟
      sunPosition: {
        azimuth: sunPosition.azimuth * 180 / Math.PI, // 转换为度
        altitude: sunPosition.altitude * 180 / Math.PI, // 转换为度
      },
      sunTimes: {
        sunrise: sunTimes.sunrise,
        sunset: sunTimes.sunset,
        solarNoon: sunTimes.solarNoon,
        nadir: sunTimes.nadir
      },
      coordinates: { lat, lng },
      success: true
    };
  } catch (error) {
    console.error('Error calculating solar time with Suncalc:', error);
    return {
      originalTime: date,
      solarTime: date, // 如果计算失败，返回原时间
      timeCorrection: 0,
      error: error.message,
      success: false
    };
  }
}

/**
 * 计算时间修正值
 * @param {Date} date - 日期
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @param {Object} sunPosition - 太阳位置信息
 * @returns {number} 时间修正值（分钟）
 */
function calculateTimeCorrection(date, lat, lng, sunPosition) {
  // 获取当地时区
  const timezoneOffset = date.getTimezoneOffset(); // 分钟
  
  // 计算经度对应的理论时区偏移
  const longitudeTimeOffset = lng * 4; // 每度经度 = 4分钟
  
  // 获取年中第几天
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
  
  // 计算均时差 (Equation of Time)
  const gamma = 2 * Math.PI * (dayOfYear - 1) / 365;
  const equationOfTime = 229.18 * (
    0.000075 + 
    0.001868 * Math.cos(gamma) - 
    0.032077 * Math.sin(gamma) -
    0.014615 * Math.cos(2 * gamma) - 
    0.040849 * Math.sin(2 * gamma)
  );
  
  // 计算当地标准时间的经度修正
  const localStandardTimeMeridian = Math.round(lng / 15) * 15;
  const longitudeCorrection = (lng - localStandardTimeMeridian) * 4;
  
  // 总的时间修正 = 经度修正 + 均时差
  const totalCorrection = longitudeCorrection + equationOfTime;
  
  return totalCorrection;
}

/**
 * 获取太阳时信息的详细描述
 * @param {Object} solarResult - calculateSolarTimeWithSuncalc的返回结果
 * @returns {string} 格式化的描述信息
 */
export function getSolarTimeDescription(solarResult) {
  if (!solarResult.success) {
    return `计算失败: ${solarResult.error || '未知错误'}`;
  }
  
  const { originalTime, solarTime, timeCorrection, coordinates } = solarResult;
  
  const timeDiff = Math.abs(timeCorrection);
  const direction = timeCorrection > 0 ? '快' : '慢';
  
  return `
真太阳时: ${solarTime.toLocaleString()}
当地时间: ${originalTime.toLocaleString()}
时间修正: ${direction} ${timeDiff.toFixed(1)} 分钟
坐标: ${coordinates.lat.toFixed(4)}°N, ${coordinates.lng.toFixed(4)}°E
  `.trim();
}

/**
 * 批量计算多个时间点的太阳时
 * @param {Array} dates - 日期数组
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @returns {Array} 太阳时计算结果数组
 */
export function batchCalculateSolarTime(dates, lat, lng) {
  return dates.map(date => calculateSolarTimeWithSuncalc(date, lat, lng));
}

/**
 * 比较Suncalc方法与传统方法的差异
 * @param {Date} date - 日期
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @param {Function} traditionalMethod - 传统计算方法
 * @returns {Object} 比较结果
 */
export function compareSolarTimeMethods(date, lat, lng, traditionalMethod) {
  try {
    const suncalcResult = calculateSolarTimeWithSuncalc(date, lat, lng);
    const traditionalResult = traditionalMethod ? traditionalMethod(date, lng, lat, true) : null;
    
    let timeDifference = 0;
    if (traditionalResult && suncalcResult.success) {
      timeDifference = (suncalcResult.solarTime.getTime() - traditionalResult.getTime()) / (1000 * 60); // 分钟
    }
    
    return {
      suncalc: suncalcResult,
      traditional: traditionalResult,
      timeDifference: timeDifference, // 分钟
      comparison: {
        method: 'Suncalc vs Traditional',
        difference: `${Math.abs(timeDifference).toFixed(1)} 分钟`,
        preferred: Math.abs(timeDifference) < 5 ? 'Suncalc' : 'Traditional'
      }
    };
  } catch (error) {
    console.error('Error comparing solar time methods:', error);
    return {
      error: error.message,
      success: false
    };
  }
}

/**
 * 检查当前时间是否适合使用太阳时计算
 * @param {Date} date - 日期
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @returns {Object} 检查结果
 */
export function validateSolarTimeCalculation(date, lat, lng) {
  try {
    const sunTimes = SunCalc.getTimes(date, lat, lng);
    const now = date.getTime();
    
    // 检查是否在有效的太阳时计算范围内
    const isValidTime = sunTimes.sunrise && sunTimes.sunset &&
                       now >= sunTimes.sunrise.getTime() - 2 * 60 * 60 * 1000 && // 日出前2小时
                       now <= sunTimes.sunset.getTime() + 2 * 60 * 60 * 1000;   // 日落后2小时
    
    return {
      valid: isValidTime,
      sunTimes,
      recommendation: isValidTime ? 
        '适合使用太阳时计算' : 
        '建议使用标准时间或检查日期/坐标是否正确',
      coordinates: { lat, lng }
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
      recommendation: '坐标或日期无效，请检查输入参数'
    };
  }
}

/**
 * 兼容性包装函数，与现有系统集成
 * @param {Date} date - 日期
 * @param {number} lng - 经度
 * @param {number} lat - 纬度 
 * @param {boolean} useSolarTime - 是否使用真太阳时
 * @returns {Date} 计算后的时间
 */
export function calculateSolarTimeCompat(date, lng, lat, useSolarTime = true) {
  if (!useSolarTime) {
    return new Date(date);
  }
  
  const result = calculateSolarTimeWithSuncalc(date, lat, lng);
  return result.success ? result.solarTime : new Date(date);
}

// 导出主要计算函数用于外部调用
export default calculateSolarTimeWithSuncalc;
