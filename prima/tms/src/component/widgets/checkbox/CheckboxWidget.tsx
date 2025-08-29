import Checkbox from '@material-ui/core/Checkbox';
import React, { useEffect } from 'react';
import './Checkboxes.css';


interface CheckboxWidgetProps {
  checked: boolean,
  onCheckChange?: any,
}

function CheckboxWidget(props: CheckboxWidgetProps) {
  const { checked, onCheckChange } = props;
  const [checkedValue, setCheckedValue] = React.useState<any>(checked);

  const checkboxValueOnChange = (e: any) => {
    onCheckChange(e);
    setCheckedValue(!checkedValue)
  }
  useEffect(() => {
    setCheckedValue(checked ? true : false);
  }, [checked, onCheckChange]);

  return (
    <Checkbox
      className="custom-checkbox"
      checked={checkedValue}
      onChange={checkboxValueOnChange}
      value="primary"
      inputProps={{ 'aria-label': 'primary checkbox' }}
    />
  );
}

export default CheckboxWidget;