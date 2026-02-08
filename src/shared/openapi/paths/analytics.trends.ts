export const analyticsTrendsPath = {
    "/api/v1/analytics/trends": {
        get: {
            summary: "Get income vs expenses trends",
            description: "Returns aggregated income and expenses data grouped by interval",
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
                {
                    name: "interval",
                    in: "query",
                    required: true,
                    schema: {
                        type: "string",
                        enum: ["day", "week", "month", "year"],
                    },
                },
            ],
            responses: {
                200: {
                    description: "Trends Data",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/TrendData",
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