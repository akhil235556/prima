import React, { ReactNode } from "react";
import "./PushNotificationCard.css";

interface NotificationCardProps {
    children: ReactNode
}
export default function PushNotificationCard(props: NotificationCardProps) {
    const { children } = props;
    return (
        <div className="push-notification-card">
            {children}
        </div>
    );

}