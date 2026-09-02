export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

const TH_MONTHS_SHORT = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

const EN_MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function getMonthNames(language: string): string[] {
  return language === 'th' ? TH_MONTHS_SHORT : EN_MONTHS_SHORT;
}

export function formatDisplayDate(key: string, language: string): string {
  const date = fromDateKey(key);
  const months = getMonthNames(language);
  const day = date.getDate();
  const month = months[date.getMonth()];

  if (language === 'th') {
    return `${day} ${month} ${date.getFullYear() + 543}`;
  }

  return `${month} ${day}, ${date.getFullYear()}`;
}

const TH_WEEKDAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const EN_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ใช้เป็นหัวข้อของแต่ละกลุ่มวันในลิสต์รายการ เช่น "วันนี้", "เมื่อวาน", "อังคาร 18 ส.ค."
export function formatDayHeader(
  dateKey: string,
  language: string,
  t: { common: { today: string; yesterday: string } }
): string {
  const today = toDateKey(new Date());
  const yesterday = toDateKey(new Date(Date.now() - 24 * 60 * 60 * 1000));

  if (dateKey === today) return t.common.today;
  if (dateKey === yesterday) return t.common.yesterday;

  const date = fromDateKey(dateKey);
  const months = getMonthNames(language);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const weekday = (language === 'th' ? TH_WEEKDAYS : EN_WEEKDAYS)[
    date.getDay()
  ];

  if (language === 'th') {
    return `${weekday} ${day} ${month}`;
  }

  return `${weekday}, ${month} ${day}`;
}