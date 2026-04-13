declare module 'lunar-javascript' {
  export class Solar {
    static fromDate(date: Date): Solar;
    getLunar(): Lunar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
  }

  export class Lunar {
    getFestivals(): string[];
    getJieQi(): string | null;
    getYearInGanZhi(): string;
    getYearShengXiao(): string;
    getMonthInChinese(): string;
    getDayInChinese(): string;
  }

  export class Holiday {
    getName(): string;
    isWork(): boolean;
    getTarget(): string;
    getDay(): string;
  }

  export class HolidayUtil {
    static getHoliday(year: number, month: number, day: number): Holiday | null;
    static getHoliday(dateStr: string): Holiday | null;
  }
}
