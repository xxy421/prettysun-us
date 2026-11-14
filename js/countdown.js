/**
 * 倒计时功能
 * 自动计算到下一个生日（1月12日）的倒计时
 * 以及在一起的时间（实时更新到秒）
 */

// 生日月份和日期
const BIRTHDAY_MONTH = 11; // 1月（0-11）
const BIRTHDAY_DAY = 16;   // 12日

// 在一起的起始日期：2018年7月1日
const START_DATE = new Date('2026-02-13T20:31:00');

/**
 * 获取下一个生日日期
 * @returns {Date} 下一个1月12日的日期
 */
function getNextBirthday() {
    const now = new Date();
    const currentYear = now.getFullYear();

    // 今年的生日
    const thisYearBirthday = new Date(currentYear, BIRTHDAY_MONTH, BIRTHDAY_DAY, 0, 0, 0);

    // 如果今年的生日还没过，返回今年的
    if (now < thisYearBirthday) {
        return thisYearBirthday;
    }

    // 否则返回明年的生日
    return new Date(currentYear + 1, BIRTHDAY_MONTH, BIRTHDAY_DAY, 0, 0, 0);
}

/**
 * 更新倒计时显示
 */
function updateCountdown() {
    const now = new Date();

    // 检查是否是生日当天 (彩蛋3触发条件)
    const isBirthday = checkIfBirthday(now);

    const countdownElement = document.getElementById('countdown');
    const daysElement = document.getElementById('days');

    if (!countdownElement) {
        console.warn('倒计时元素未找到');
        return;
    }

    if (isBirthday) {
        // 生日当天显示特殊信息
        const countdownText = countdownElement.querySelector('.countdown-text');
        const countdownNumbers = countdownElement.querySelector('.countdown-numbers');

        if (countdownText) {
            countdownText.textContent = '🎂';
        }
        if (countdownNumbers) {
            countdownNumbers.innerHTML = '<div class="countdown-unit"><span class="countdown-value">生日快乐！</span></div>';
        }

        // 触发生日特效（在 easter-eggs.js 中定义）
        if (typeof triggerBirthdayEffect === 'function') {
            triggerBirthdayEffect();
        }
    } else {
        // 计算到下一个生日的天数
        const nextBirthday = getNextBirthday();
        const diffTime = nextBirthday - now;
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // 调试信息
        console.log('当前时间:', now.toLocaleString('zh-CN'));
        console.log('下一个生日:', nextBirthday.toLocaleString('zh-CN'));
        console.log('时间差(毫秒):', diffTime);
        console.log('剩余天数:', days);

        // 更新显示
        const countdownText = countdownElement.querySelector('.countdown-text');
        if (countdownText) {
            countdownText.textContent = '距离你的生日还有';
        }

        if (daysElement) {
            daysElement.textContent = days;
            console.log('已更新天数显示:', days);
        } else {
            console.error('找不到 id="days" 的元素');
        }
    }
}

/**
 * 检查今天是否是生日
 * @param {Date} date 要检查的日期
 * @returns {boolean} 是否是生日
 */
function checkIfBirthday(date) {
    const month = date.getMonth(); // 0-11
    const day = date.getDate();

    // 生日：1月12日
    return month === BIRTHDAY_MONTH && day === BIRTHDAY_DAY;
}

/**
 * 获取到生日的剩余天数
 * @returns {number} 剩余天数
 */
function getDaysUntilBirthday() {
    const now = new Date();
    const nextBirthday = getNextBirthday();
    const diffTime = nextBirthday - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 计算在一起的天数
 * @returns {number} 在一起的天数
 */
function getDaysTogether() {
    const now = new Date();
    const diffTime = now - START_DATE;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 更新在一起天数显示（实时到秒）
 */
function updateDaysTogether() {
    const now = new Date();
    const diffTime = now - START_DATE;

    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

    const daysElement = document.getElementById('daysTogether');
    const hoursElement = document.getElementById('hoursTogether');
    const minutesElement = document.getElementById('minutesTogether');
    const secondsElement = document.getElementById('secondsTogether');

    if (daysElement) daysElement.textContent = days;
    if (hoursElement) hoursElement.textContent = hours;
    if (minutesElement) minutesElement.textContent = minutes;
    if (secondsElement) secondsElement.textContent = seconds;
}

// 定时器ID
let countdownTimer = null;
let daysTogetherTimer = null;

// 页面加载时初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        updateCountdown();
        updateDaysTogether();
        // 每小时更新一次倒计时
        countdownTimer = setInterval(updateCountdown, 3600000);
        // 每秒更新一次在一起的时间
        daysTogetherTimer = setInterval(updateDaysTogether, 1000);
    });
} else {
    updateCountdown();
    updateDaysTogether();
    countdownTimer = setInterval(updateCountdown, 3600000);
    daysTogetherTimer = setInterval(updateDaysTogether, 1000);
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateCountdown,
        checkIfBirthday,
        getDaysUntilBirthday,
        getDaysTogether,
        updateDaysTogether
    };
}
