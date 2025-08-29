import React from 'react';
import './StepperPlanStatus.css';

function StepperPlanStatus(props: any) {
    const { data } = props;
    return (
        <div>
            <ul>
                <li>
                    <p>{data?.totalRoutes || "—"}</p>
                    <p>Number of routes</p>
                </li>
                <li>
                    <p>{data?.totalCost || "—"}</p>
                    <p>Total cost</p>
                </li>
                <li>
                    <p>{data?.totalKms || "—"}</p>
                    <p>Total km driven</p>
                </li>
                <li>
                    <p className='orange-text'>{data?.totalOrders || "—"}/{data?.totalTasks || "—"}</p>
                    <p className='orange-text'>{isNaN(data?.totalTasks - data?.totalOrders) ? "NA" : data?.totalTasks - data?.totalOrders} shipments skipped</p>
                </li>
                <li>
                    <p>{data?.dashBoardVehicles || "—"}/{data?.totalVehicles || "—"}</p>
                    <p># of vehicles</p>
                </li>
                <li>
                    <p>{data?.totalDuration || "—"}</p>
                    <p>Duration</p>
                </li>
            </ul>
        </div>
    )
}

export default StepperPlanStatus
