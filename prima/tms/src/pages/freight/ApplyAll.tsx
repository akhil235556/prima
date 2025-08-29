import { TextareaAutosize } from '@material-ui/core'
import { CheckCircle } from '@material-ui/icons'
import { DateTimePicker } from '@material-ui/pickers'
import React from 'react'
import { displayDateTimeFormatter } from '../../base/utility/DateUtils'
import Button from '../../component/widgets/button/Button'

interface ApplyAllProps {
    onApply: any,
}

function ApplyAll(props: ApplyAllProps) {
    const { onApply } = props
    const [params, setParams] = React.useState<any>({})
    return (
        <div className="dispatchInput row">
            <div className="form-group col-12 col-md-4 pl-md-0 pr-md-2 p-0">
                <label className="picker-label">{"Dispatch By"}</label>
                <DateTimePicker
                    className="custom-date-picker"
                    placeholder="Dispatch By"
                    minDate={new Date()}
                    helperText={""}
                    format={displayDateTimeFormatter}
                    value={params?.dispatchBy || null}
                    onChange={(date: any) => {
                        setParams({
                            ...params,
                            dispatchBy: date,
                        })
                    }}
                />
            </div>
            <div className="form-group col-12 col-md-4 pl-md-2 pr-md-3 p-0">
                <div className="billing-info-remark pt-0">
                    <label>Remarks</label>
                    <TextareaAutosize
                        rowsMin={1}
                        rowsMax={1}
                        aria-label="empty textarea"
                        placeholder="Remarks"
                        value={params?.remarks || ""}
                        onChange={(event: any) => {
                            setParams({
                                ...params,
                                remarks: event.target.value
                            })
                        }}
                    />
                </div>
            </div>
            <div className="applyAll">
                <Button
                    title={"Apply All"}
                    onClick={(params.dispatchBy || params.remarks) && (() => onApply(params))}
                    rightIcon={""}
                    leftIcon={<CheckCircle />}
                    buttonStyle={"btn-blue apply-btn"}
                    primaryButton={true}
                />
            </div>
        </div>
    )
}

export default ApplyAll