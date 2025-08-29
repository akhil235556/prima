import React, { ReactNode, useEffect, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

interface InfiniteScrollListProps {
    children: ReactNode,
    onReachEnd: Function,
    className: string,
    nextPage: boolean,
    boxRef: any,
}

const InfiniteScrollList = ({ boxRef, onReachEnd, ...props }: InfiniteScrollListProps) => {
    let isFetching = useSelector((state: any) => state.appReducer.isLoading, shallowEqual)
    const observer = useRef<any>(null);
    useEffect(() => {
        const lastBox = boxRef.current;
        if (lastBox) {
            const options = {
                threshold: 1.0,
            };
            const observerCallback = (entries: any) => {
                entries.forEach((entry: any) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 1.0) {
                        onReachEnd();
                    }
                })
            }
            observer.current = new IntersectionObserver(observerCallback, options)
            observer.current.observe(lastBox)
        }
        return () => {
            if (observer.current) {
                observer.current.unobserve(lastBox);
                // observer.current.disconnect();
            }
        }
    }, [boxRef, observer, onReachEnd]);

    return (
        <>
            <div
                className={props.className}
            >
                {props.children}
                {props.nextPage && isFetching && 'Fetching more list items...'}
            </div>
        </>
    );
};

export default InfiniteScrollList;