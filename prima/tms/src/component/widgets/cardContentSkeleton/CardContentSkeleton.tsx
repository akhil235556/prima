import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';
import './CardContentSkeleton.css';

interface CardContentSkeletonProps {
    row: number,
    column: number,
    className?: any,
}

export default function CardContentSkeleton(props: CardContentSkeletonProps) {
    const { row, column, className } = props;

    return (
        <div className={className ? "card-content-skeleton " + className : "card-content-skeleton"}>
            <div className="container-fluid">
                {Array.from(Array(row)).map((element: any, index: any) => (
                    <div className="row"
                        key={index}>
                        {Array.from(Array(column)).map((element: any, index: any) => (
                            <div className={"col-" + (12 / column)}
                                key={index}>
                                <Skeleton animation="wave" className="skel-label" />
                                <div className="skeleton-bg">
                                    <Skeleton animation="wave" />
                                </div>
                            </div>
                        ))}

                    </div>
                ))}
            </div>
        </div>
    );
}