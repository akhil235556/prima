import Chip from "@material-ui/core/Chip";
import React from "react";
import { isNullValue } from '../../base/utility/StringUtils';
import "./Chips.css";

interface ChipsProps {
  label: string;
  onDelete?: React.EventHandler<any>;
}

export default function Chips(props: ChipsProps) {
  return (
    !isNullValue(props.label) ? <Chip
      className="chip-btn"
      label={props.label}
      onDelete={props.onDelete}
      variant="outlined"
    /> : null
  );
}
