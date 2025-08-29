import React from 'react';
import './NotFound.css';

interface NotFoundProps {
    header: string,
    message?: string,
    image?: any,
    customMessage?: any
    showSearchError?: boolean
}

function DataNotFound(props: NotFoundProps) {
    const { customMessage, showSearchError = false } = props;
    return (
        <div className="not-found data-not-found text-center">
            <div className={showSearchError ? "pincode-incorrect" : "ContWrap"}>
                <div className="imgbox">
                    {props.image ?
                        <img src={props.image} className="img-fluid" alt="Data Not Found" /> :
                        <img src="/images/data-not-found.png" className="img-fluid" alt="Data Not Found" />
                    }
                </div>
                <div className="content">
                    {!showSearchError && <h4> {props.header}</h4>}
                    {customMessage ? customMessage : <p>{props.message}</p>}
                </div>
            </div>
        </div>
    );
}

DataNotFound.defaultProps = {
    header: "Sorry",
    message: "What you looking was not found or doesn’t exist.",
}

export default DataNotFound;