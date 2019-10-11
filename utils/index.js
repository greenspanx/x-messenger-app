import moment from 'moment';
import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const Viewport = {
  width,
  height
};

export function isSameDay(currentDate, previousDate) {
  if (!previousDate) {
    return false;
  }

  const currentDateMoment = moment(currentDate);
  const previousDateMoment = moment(previousDate);

  if (!currentDateMoment.isValid() || !previousDateMoment.isValid()) {
    return false;
  }

  return currentDateMoment.isSame(previousDateMoment, 'day');
}

export function getRandomID(l) {
  return [...Array(l)].map(_ => ((Math.random() * 36) | 0).toString(36)).join``;
}

export function getPhotoPreview(preview) {
  return { preview: { uri: `data:image/png;base64,${preview}` } };
}

export function jsonToUrl(obj) {
  return Object.keys(obj)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
    .join('&');
}

export function getBackgroundColorByID(id) {
  var colors = [
    '#E57373',
    '#F06292',
    '#BA68C8',
    '#9575CD',
    '#7986CB',
    '#64B5F6',
    '#4DD0E1',
    '#4FC3F7',
    '#4DB6AC',
    '#81C784',
    '#AED581',
    '#DCE775',
    '#FFF176',
    '#FFD54F',
    '#FFB74D',
    '#FF8A65',
    '#A1887F',
    '#E0E0E0',
    '#90A4AE'
  ];
  var index = Math.abs(parseInt(id.replace(/\D/g, ''), 10)) % colors.length;
  return colors[index];
}

export function isValidPhoneNumber(p) {
  // eslint-disable-next-line no-useless-escape
  var phoneRe = /^[0-9]{10}$/im;
  var digits = p.replace(/\D/g, '');
  return phoneRe.test(digits);
}
