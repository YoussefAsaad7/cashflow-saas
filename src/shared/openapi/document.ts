import {components} from "./components";
import { analyticsSummaryPath } from "./paths/analytics.summary";
import { analyticsTrendsPath } from "./paths/analytics.trends";

export const openApiDocument = {
    openapi: "3.0.0",
    info: {
        title: "Cashflow API",
        version: "1.0.0",
        description: "Internal API documentation for Cashflow",
    },
    tags: [
        {name: "Analytics", description: "Analytics & reporting endpoints"},
    ],
    paths: {
        ...analyticsTrendsPath,
        ...analyticsSummaryPath,
    },
    components,
};