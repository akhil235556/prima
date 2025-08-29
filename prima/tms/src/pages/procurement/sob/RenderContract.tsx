import { Add, Close, Info } from "@material-ui/icons";
import React, { useEffect } from "react";
// import { partnerLevel } from "../../../base/constant/ArrayList";
import LabelBox from "../../../component/labelBox/LabelBox";
import AutoComplete from "../../../component/widgets/AutoComplete";
import AutoSuggest from "../../../component/widgets/AutoSuggest";
import Button from "../../../component/widgets/button/Button";
import { CustomTooltipTable } from "../../../component/widgets/CustomToolTipTable";
import NumberEditText from "../../../component/widgets/NumberEditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import "./RenderContract.css";
import SobEditModal from "./SobEditModal";

export const RenderContract = (props: any) => {
  const {
    isAddButton,
    onAdd,
    onRemove,
    element,
    onChangeContract,
    contractsList,
    partnerLevel
  } = props;
  const [locationScore, setLocationScore] = React.useState<any>([]);
  const [openEditModal, toggleEditModal] = React.useState(false);
  const [selectedContract, setSelectedContract] = React.useState<any>({})


  useEffect(() => {
    setLocationScore([
      {
        location: "In Transit Efficiency",
        score: element?.partner?.inTransitScore
          ? `${element?.partner?.inTransitScore}/8`
          : "NA",
      },
      {
        location: "Placement Efficiency",
        score: element?.partner?.contributionScore
          ? `${element?.partner?.contributionScore}/2`
          : "NA",
      },
    ]);
  }, [element]);

  return (
    <div className="render--sob-wrapper">
      {openEditModal && (
        <SobEditModal
          open={openEditModal} onClose={() => { toggleEditModal(false) }} contract={selectedContract}
        />
      )}
      <div className="custom-form-row row align-items-center">
        <div className="form-group col-md">
          <AutoComplete
            label={`Transporter`}
            placeHolder={"select transporter"}
            error={element.partnerError}
            onChange={(value: OptionType) => {
              onChangeContract({ ...element, ...value.value, partnerError: "", contractCodeError: "" }, element.index);
            }}
            labelStyle={"center-align"}
            options={contractsList}
            value={
              element.partner
                ? {
                  label: element.partner?.name,
                  value: element,
                }
                : undefined
            }
            toolTip={() => (
              <CustomTooltipTable
                tableColumn={[
                  {
                    description: "Location",
                    name: "location",
                    format: (value: any) => value || " NA",
                  },

                  {
                    description: "Score",
                    name: "score",
                    format: (value: any) => value || "NA",
                  },
                ]}
                tableData={locationScore}
                customIcon={
                  <div>
                    <span className="render--sob-transporter-score">
                      <span> Score </span>
                      <span className="render--sob-transporter-value">
                        {element?.partner?.participantScore || " NA"}
                      </span>
                    </span>
                    <Info />
                  </div>
                }
              />
            )}
          />
        </div>
        <div className="form-group col-md">
          {element.contractCode ? <LabelBox
            label={"Contract"}
            text={element.contractCode}
            labelStyle={"center-align labelbox--label"}
            onClick={() => {
              setSelectedContract({ contractId: element.contractCode }); toggleEditModal(true)
            }}
          /> :
            <AutoSuggest
              label={"Contract"}
              placeHolder={"select contract"}
              onChange={() => { }}
              suggestions={[]}
              onSelected={() => { }}
              error={element.contractCodeError}
              labelStyle={"center-align"}
              value={element.contractCode}
            />

          }
        </div>

        <div className="form-group col-md">
          <AutoComplete
            label={"Level"}
            placeHolder={"select level"}
            error={element.levelError}
            onChange={(value: OptionType) => {
              onChangeContract(
                {
                  ...element,
                  level: value,
                  levelError: ""
                },
                element.index
              );
            }}
            options={partnerLevel}
            value={element.level}
          />
        </div>
        <div className="form-group col-md">
          <NumberEditText
            label={"Contribution %"}
            placeholder={"enter contribution %"}
            maxLength={20}
            allowNegative={false}
            decimalSeparator={false}
            error={element.allocationPercentageError}
            onChange={(text: any) => {
              onChangeContract(
                {
                  ...element,
                  allocationPercentage: text,
                  allocationPercentageError: ""
                },
                element.index
              );
            }}
            value={element.allocationPercentage}
          />
        </div>

        <div className="form-group col-2 col-md-1 col-lg-1 creat-add-btn add-button-wrapp">
          <Button
            buttonStyle={isAddButton ? "add-btn" : "minus-btn"}
            leftIcon={isAddButton ? <Add /> : <Close />}
            onClick={() => {
              isAddButton ? onAdd({}) : onRemove(element.index);
            }}
          />
        </div>
      </div>
    </div>
  );
};
