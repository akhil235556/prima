import { FormControlLabel } from "@material-ui/core";
import Radio from '@material-ui/core/Radio/Radio';
import { GetApp } from '@material-ui/icons';
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { JobFileType } from "../../../../base/constant/ArrayList";
import { primaEngineLabel } from "../../../../base/constant/MessageUtils";
import { PlanningHistoryUrl } from "../../../../base/constant/RoutePath";
import { isObjectEmpty } from "../../../../base/utility/StringUtils";
import PageContainer from '../../../../component/pageContainer/PageContainer';
import Button from '../../../../component/widgets/button/Button';
import { InfoTooltip } from "../../../../component/widgets/tooltip/InfoTooltip";
import { showAlert } from "../../../../redux/actions/AppActions";
import { uploadPlanningFile } from "../../../../serviceActions/BulkUploadServiceActions";
import { downloadPlanningUploadSample } from "../../../../serviceActions/PlanningServiceAction";
import ErrorDisplayModal from "../ErrorDisplayModal";
import './ShipmentsUpload.css';

function ShipmentsUpload(props: any) {
  const history = useHistory();
  const { engineConfigParams } = props;
  const [file, setFile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [fileJobType, setFileJobType] = React.useState<string | undefined>(JobFileType.SHIPMENT);
  //const [fileType, setFileType] = React.useState<any>("");
  const [fileUploadTime, setFileUploadTime] = React.useState<any>(null);
  const [openErrorModal, setOpenErrorModal] = React.useState<boolean>(false);
  const [errorDetails, setErrorDetails] = React.useState<any>({});
  const userInfo = useSelector((state: any) => state.appReducer.userInfo, shallowEqual);
  const acceptFiles = ".xlsx";
  const appDispatch = useDispatch();
  const handelValueChange = (e: any) => {
    setFileJobType(e.target.value)
  }

  return (<>
    <ErrorDisplayModal
      open={openErrorModal}
      onClose={() => {
        setFileUploadTime(undefined);
        setFile(null);
        setOpenErrorModal(false);
      }}
      details={errorDetails}
    />
    <PageContainer>
      <div className="drop-container">
        <ul className='drop-label'>
          <li>
            <FormControlLabel
              value={JobFileType.DEMAND_ORDER}
              control={<Radio />}
              label="Demand Order"
              onChange={e => handelValueChange(e)}
              checked={fileJobType === JobFileType.DEMAND_ORDER}
              disabled={true}
            />
          </li>
          <li>
            <FormControlLabel
              value={JobFileType.SHIPMENT}
              control={<Radio />}
              label="Shipments"
              onChange={e => handelValueChange(e)}
              checked={fileJobType === JobFileType.SHIPMENT}
            />
          </li>
        </ul>
        <div className='drop-file'>
          <>
            <img src="/images/upload_file.png" alt="" />
            <p className='shipment-excel'>Upload a .xlsx file here</p>
            {/* <p>or</p> */}
            <div>
              <form>
                <div className={`shipment-select ${isObjectEmpty(engineConfigParams) ? "disable-wrap" : ""}`}>
                  <InfoTooltip
                    className={'shipment-button-tooltip'}
                    title={isObjectEmpty(engineConfigParams) ? primaEngineLabel : file ? file.name : "Select a File"}
                    placement={"top"}
                    disableInMobile={"false"}
                    infoText={<label className="disable-file" htmlFor="contained-button-file">{file ? file.name : "Select a File"}</label>}
                  />
                  <input
                    title={""}
                    disabled={loading || isObjectEmpty(engineConfigParams)}
                    key={fileUploadTime}
                    accept={acceptFiles || ".csv"}
                    type="file"
                    id="contained-button-file"
                    onChange={(event: any) => handleUpload(event)}
                  />
                </div>
              </form>
            </div>
          </>
          <>
            {<span className="download-csv"
              onClick={() => {
                if (isObjectEmpty(engineConfigParams)) {
                  appDispatch(showAlert(primaEngineLabel, false));
                } else {
                  appDispatch(downloadPlanningUploadSample({ ...engineConfigParams })).then((response: any) => {
                    if (!isObjectEmpty(response)) {
                      response && window.open(response.link);
                    }
                  })
                }
              }}
            >
              <GetApp />{"Download Sample File"}</span>}
          </>
        </div>
        <Button
          buttonStyle={"btn-blue d-flex m-auto"}
          title={"Process"}
          loading={loading}
          onClick={() => {
            if (file && file.size > 0) {
              uploadCsv();
            } else {
              appDispatch(showAlert("Select .xlsx file to upload.", false));
              setFileUploadTime(undefined);
              setFile(null);
            }
          }}
        />
      </div>
    </PageContainer>
  </>
  );

  function handleUpload(event: any) {
    if (event && event.target && event.target.files) {
      const [file] = event.target.files
      if (acceptFiles) {
        if (file.name.includes(".xls")) {
          //setFileType("xls");
          setFile(file);
          setFileUploadTime(new Date().getTime());
        } else if (file.name.includes(".xlsx")) {
          //setFileType("xlsx");
          setFile(file);
          setFileUploadTime(new Date().getTime());
        } else if (file.name.includes(".csv")) {
          //setFileType("csv");
          setFile(file);
          setFileUploadTime(new Date().getTime());
        } else {
          appDispatch(showAlert("Select csv, xls or xlsx file only", false));
        }
      }
    }
  }

  function uploadCsv() {
    const formData = new FormData();
    formData.append("file", file);
    formData.append('planning_name', "mid-mile-sequential-planning");
    formData.append("partition", userInfo.partition);
    formData.append("tenant", userInfo.tenant);
    formData.append("node", userInfo.locationCode);
    formData.append("engine_name", engineConfigParams.engine_name);
    formData.append("sub_engine_name", engineConfigParams.sub_engine_name);
    setLoading(true);
    appDispatch(uploadPlanningFile(formData, acceptFiles, setErrorDetails, setOpenErrorModal)).then((response: any) => {
      if (response) {
        if (response.code === 400 && response?.details?.errors?.length > 0) {
          setErrorDetails(response?.details);
          setOpenErrorModal(true);
        }
        setFileUploadTime(undefined);
        // setFile(null);
        setLoading(false);
        if (response.code !== 400) {
          appDispatch(showAlert(response?.message))
          history.push(PlanningHistoryUrl)
        }
      } else {
        setLoading(false)
      }
    })
  }
}

export default ShipmentsUpload