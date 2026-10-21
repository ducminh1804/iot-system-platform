export type TimeRange = 'Days' | 'Week' | 'Month';

export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  numericValue: number;
  change: string;
  isPositive: boolean;
  icon: string;
}

export interface RevenueSourceItem {
  id: string;
  name: string;
  percentage: number;
  amount: string;
  color: string;
  strokeDashoffset?: number;
}

export interface GrowthDataPoint {
  month: string;
  value: number; // in thousands (k)
  dateLabel: string;
  tooltipValue: string;
}
