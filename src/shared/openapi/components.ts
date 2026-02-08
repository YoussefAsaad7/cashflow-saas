export const components = {
    schemas: {
        TrendData: {
            type: "object",
            properties: {
                date: {type: "string", example: "2025-01-01"},
                income: {type: "number", example: 1200},
                expenses: {type: "number", example: 1000},
                net: {type: "number", example: 200},
            },
            required: ["date", "income", "expenses", "net"],
        },
        ApiError: {
            type: "object",
            properties: {
                error: {type: "string"},
            },
            required: ["error"],
        },
    },
};