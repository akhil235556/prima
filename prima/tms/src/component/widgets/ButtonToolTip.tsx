import * as React from "react";
import Button from "./button/Button";
import { InfoTooltip } from "./tooltip/InfoTooltip";

interface CustomButtonToolTipProps {
  toolTipTitle?: string;
  title: string;
  buttonStyle: string;
  leftIcon: any;
  onClick: React.MouseEventHandler<Element>;
  disable?: boolean;
  secondaryBtnCondition?: boolean;
}

export const CustomButtonToolTip = (props: CustomButtonToolTipProps) => {
  return (
    <>
      {props?.toolTipTitle ? (
        <InfoTooltip
          title={props?.toolTipTitle}
          customIcon={
            <Button {...props} />
          }
        />
      ) :
        <Button {...props} />
      }
    </>
  );
};
