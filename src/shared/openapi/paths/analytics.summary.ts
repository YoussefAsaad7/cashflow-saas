export const analyticsSummaryPath = {
    "/api/v1/analytics/summary": {
        get: {
            summary: "Get financial summary",
            description: "Returns aggregated financial summary data",
            tags: ["Analytics"],
            parameters: [
                {
                    name: "from",
                    in: "query",
                    required: true,
                    schema: {type: "string", format: "date-time"},
                    example: "2025-01-01T00:00:00.000Z",
                },
                {
                    name: "to",
                    in: "query",
                    required: true,
                    schema: {type: "string", format: "date-time"},
                    example: "2025-01-31T23:59:59.999Z",
                },
            ],
            responses: {
                200: {
                    description: "Financial Summary",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    totalIncome: {
                                        $ref: "#/components/schemas/KPI",
                                    },
                                    totalExpenses: {
                                        $ref: "#/components/schemas/KPI",
                                    },
                                    netCashFlow: {
                                        $ref: "#/components/schemas/KPI",
                                    },
                                    savingsRate: {
                                        $ref: "#/components/schemas/KPI",
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: "Invalid query parameters",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ApiError",
                            },
                        },
                    },
                },
                401: {
                    description: "Unauthorized",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ApiError",
                            },
                        },
                    },
                },
                
            },
        },
    },


}