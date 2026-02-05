import {z} from 'zod';
import { dateRangeSchema } from '../date-range.schema';
export const intervalSchema = z.enum(['day', 'month', 'week', 'year']);

export const trendsQuerySchema = dateRangeSchema.extend({
    interval: intervalSchema,
});
