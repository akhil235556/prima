import React, { ReactNode } from "react";
import ListingSkeleton from "../widgets/listingSkeleton/ListingSkeleton";
import { isMobile } from "../../base/utility/ViewUtils";

interface PageContainerProps {
    children: ReactNode,
    loading?: boolean,
    listData?: any
}
export default function PageContainer(props: PageContainerProps) {
    const { children, loading, listData } = props;
    return (
        <div className="dispatch-card-wrapper">
            {isMobile ?
                (loading ? (listData ? <>{children}<ListingSkeleton /></> : <ListingSkeleton />) : children)
                : (loading ? <ListingSkeleton /> : children)
            }
        </div >
    );

}