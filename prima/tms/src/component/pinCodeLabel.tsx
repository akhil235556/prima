import React from "react";

interface PincodeLabelProps {
    showPinCodeList: any
    setShowPinCodeList: any
}

export default function PincodeLabel(props: PincodeLabelProps) {
    const { showPinCodeList, setShowPinCodeList } = props;

    function togglePinCode(index: any) {
        showPinCodeList[index].selected = !showPinCodeList[index].selected;
        setShowPinCodeList([...showPinCodeList]);
    }

    return (
        <div className="odaPincode">
            {showPinCodeList?.map((pincode: any, indx: any) =>
                <button
                    className={pincode?.selected ? "select-pincode" : "deselect-pincode"}
                    key={indx}
                    onClick={() => togglePinCode(indx)}>
                    <span>{pincode?.value}</span>
                    <span>{<img src={`/images/${pincode?.selected ? 'tick-icon' : 'cross-icon'}.svg`} alt="tick-icon" key={indx} />}</span>
                </button>
            )}
        </div >
    );
}

