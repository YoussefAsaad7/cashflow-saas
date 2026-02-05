export type Interval = 'day' | 'week' | 'month' | 'year';

export type TrendData = {
    date: string;
    income: number;
    expenses: number;
    net: number;
};

export type TrendsResponse = TrendData[];