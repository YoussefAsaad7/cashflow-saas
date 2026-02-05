import {z} from 'zod';

export const isoDateSchema = z
.string()
.refine(
    (v) => !Number.isNaN(Date.parse(v)),
    {message: "Invalid ISO date string"}
);


export const dateRangeSchema = z.object({
    from: isoDateSchema,
    to: isoDateSchema,
});