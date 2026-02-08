"use client";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
const SwaggerUi = dynamic(() => import("swagger-ui-react"), {
    ssr: false,
});
export default function Page() {
    return <div className="bg-amber-50">
        <SwaggerUi url="/api/openapi" />
    </div>;
}