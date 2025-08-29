import FormControl from "@material-ui/core/FormControl/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Radio from "@material-ui/core/Radio/Radio";
import RadioGroup from "@material-ui/core/RadioGroup/RadioGroup";
import React, { useEffect } from "react";
import "./RadioButton.css";

interface RadioButtonWidget {
  jobFileType: string | undefined,
  onJobFileTypeChange: any
}
function RadioButtonWidget(props: RadioButtonWidget) {
  const { jobFileType, onJobFileTypeChange } = props;
  const [value, setValue] = React.useState<string | undefined>(jobFileType)

  useEffect(() => {
    setValue(jobFileType)
  }, [jobFileType, onJobFileTypeChange])

  const handelValueChange = (e: any) => {
    onJobFileTypeChange(e.target.value)
    setValue(e.target.value)
  }
  return (
    <div className="radio-button">
      <FormControl>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          defaultValue={value}
          value={value}
          onChange={e => handelValueChange(e)}
        >
          <FormControlLabel
            value="standard_file"
            control={<Radio />}
            label="Standard File"
          />
          <FormControlLabel
            value="integration_file"
            control={<Radio />}
            label="Integration file"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
}

export default RadioButtonWidget;
