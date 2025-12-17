export const DateUtils = {
  /**
   * Normalizes a date to Midnight UTC.
   * Use this before saving any date to the database to ensure
   * consistency regardless of the server or user's timezone.
   */
  normalizeDate(date: Date | string): Date {
    const d = new Date(date);
    // Construct a UTC date: Year, Month, Day, 00:00:00
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  },

  /**
   * Returns the start and end of a day in UTC.
   * Useful for database range queries.
   */
  getDayRange(date: Date) {
    const start = this.normalizeDate(date);
    const end = new Date(start);
    end.setUTCHours(23, 59, 59, 999);
    return { start, end };
  }
};