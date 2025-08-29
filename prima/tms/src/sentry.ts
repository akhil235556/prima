import * as Sentry from "@sentry/react";

const getHostUrl = () => {
    const host = window.location.host
    if (host.includes('.ai')) {
        return "prod"
    } else if (host.includes('.live')) {
        return "live"
    } else if (host.includes('.dev')) {
        return "dev"
    } else if (host.includes('localhost')) {
        return "localhost"
    } else {
        return "";
    }
}

export function initSentry() {
    const host = getHostUrl();
    Sentry.init({
        dsn: (host === "localhost" || host === "") ? "" : "https://ff8dd7694b7d47578de88deadcd21485@o275939.ingest.sentry.io/5510703",
    });
    Sentry.setTag("environment", host);
}