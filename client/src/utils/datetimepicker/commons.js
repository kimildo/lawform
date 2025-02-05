/**
 * @author: Seok Kyun. Choi. 최석균 (Syaku)
 * @site: http://syaku.tistory.com
 * @since: 2018. 2. 1.
 */
import Flatpickr from 'flatpickr';
import { arrayEmpty, arrayEquals } from './utils';

export const setLocale = (Locale) => {
  Flatpickr.localize(Locale);
};

export const parseDate = (dateStr, dateFormat) => Flatpickr.parseDate(dateStr, dateFormat);
export const formatDate = (dateObj, dateFormat) => Flatpickr.formatDate(dateObj, dateFormat);

export const flatpickr = (target, config, type, onChange) => (
  new Flatpickr(target, {
    ...config,
    ...type,
    wrap: false,
    inline: false,
    clickOpens: false,
    allowInput: false,
    onChange,
  })
);

export const formatDateString = (mode, dates, dateFormat) => {
  if (!Array.isArray(dates) || !dates || (dates && dates.length === 0)) return '';
  switch (mode) {
    case 'single': {
      const dateObj = typeof dates[0] === 'string' ? parseDate(dates[0], dateFormat) : dates[0];
      return formatDate(dateObj, dateFormat);
    }
    case 'multiple': {
      return [].map.call(dates, (date) => {
        const dateObj = typeof date === 'string' ? parseDate(date, dateFormat) : date;
        return formatDate(dateObj, dateFormat);
      }).join(', ');
    }
    case 'range': {
      const startDateObj = typeof dates[0] === 'string' ? parseDate(dates[0], dateFormat) : dates[0];
      const endDateObj = typeof dates[1] === 'string' ? parseDate(dates[1], dateFormat) : dates[1];
      return `${formatDate(startDateObj, dateFormat)} to ${formatDate(endDateObj, dateFormat)}`;
    }
    default: return '';
  }
};

export const uiType = (props) => {
  switch (props.type) {
    case 'datetime':
      return {
        noCalendar: false,
        enableTime: true,
        dateFormat: props.dateFormat || 'Y-m-d H:i',
      };
    case 'time':
      return {
        noCalendar: true,
        enableTime: true,
        enableSeconds: true,
        dateFormat: props.dateFormat || 'H:i:S',
      };
    default: {
      const dateFormat = props.dateFormat || 'Y. m. d';
      return { dateFormat };
    }
  }
};

/**
 * flatpickr 의 설정 disable 에서 사용될 함수를 생성하여 반환한다.
 * 생성이 되지 않는 경우 [] 을 반환한다.
 * -----------------------------------------------------
 * 현재 날짜와 종료 날짜가 같으면 null 을 반환한다.
 * 시작 및 종료 날짜는 한개만 사용할 수 있다.
 * 대상 날짜가 시작 날짜보다 크거나 같은 경우 비활성화 된다.
 * 대상 날짜가 종료 날짜보다 작거나 같은 경우 비활성화 된다.
 * 그외 날짜는 활성화 된다.
 * @dependency flatpickr
 * @param {array(date)} defaultDate 현재 날짜.
 * @param {array(date)} startDate 시작 날짜.
 * @param {array(date)} endDate 종료 날짜.
 */
export const dayDisable = (defaultDate, startDate, endDate) => {
  if (!arrayEmpty(startDate)) {
    return [(date) => {
      let accept = true;
      startDate.forEach((d) => {
        if (date >= d) accept = false;
      });
      return accept;
    }];
  } else if (!arrayEmpty(endDate)) {
    if (arrayEquals(defaultDate, endDate)) return [];
    return [(date) => {
      let accept = true;
      endDate.forEach((d) => {
        if (date <= d) accept = false;
      });
      return accept;
    }];
  }
  return [];
};

/**
 * 대상 날짜가 빈 배열이면 비교 날짜를 반환한다.
 * 1. 이전 날짜 비교가 아니고 대상 날짜가 비교 날짜 이전이면 비교 날짜를 삽입한다.
 * 2. 이전 날짜 비교이고 대상 날짜가 비교 날짜 이전이면,
 * 혹은 이전 날짜 비교가 아니고 대상 날짜가 비교 날짜 이후이면,
 * 혹은 비교 날짜와 대상 날짜가 같으면 대상 날짜를 삽입한다.
 * 1번과 2번 중 한개만 허용 된다. 둘다 맞지 않으면 빈 배열을 반환한다.
 * @param {array(date)} targetDates 대상 날짜
 * @param {array(date)} dates 비교 날짜
 * @param {bool} before 이전 날짜를 비교한다.
 */
const getDateCompareFilter = (targetDates = [], dates = [], before = true) => {
  if (targetDates.length === 0) return dates;
  const result = [];
  targetDates.forEach((target) => {
    dates.forEach((date) => {
      if (!before && target < date) {
        result.push(date);
      } else if ((before && target < date) ||
          (!before && target > date) ||
          target.valueOf() === date.valueOf()) {
        result.push(target);
      }
    });
  });

  return result;
};

/**
 * 시작 와 종료 날짜 한개만 사용할 수 있다.
 * 시작 날짜는 대상 날짜 이후와 같은 날짜만 허용된다.
 * 종료 날짜는 대상 날짜 이전와 같은 날짜만 허용된다.
 * @param {*} targetDates 내부 선택된 날짜
 * @param {*} startDate 시작 날짜
 * @param {*} endDate 종료 날짜
 */
export const dateCompare = (targetDates, startDate, endDate) => {
  if (startDate && startDate.length) {
    return getDateCompareFilter(targetDates, startDate, false);
  } else if (endDate && endDate.length) {
    return getDateCompareFilter(targetDates, endDate);
  }
  return null;
};
