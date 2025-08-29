import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";

function SobListSkeleton() {
    return (
        <div className="sob-list">
            <ul>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((element: any) => (
                    <li key={element}><span></span> <Skeleton animation="wave" /></li>
                ))}
            </ul>
        </div>


    );
}

export default SobListSkeleton;
