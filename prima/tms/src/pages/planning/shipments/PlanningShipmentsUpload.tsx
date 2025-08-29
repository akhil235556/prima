import { KeyboardBackspace } from '@material-ui/icons';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { isMobile } from "../../../base/utility/ViewUtils";
import DataNotFound from '../../../component/error/DataNotFound';
import Filter from '../../../component/filter/Filter';
import { getPlanningEngines } from '../../../serviceActions/PlanningServiceAction';
import PlanningEngine from './planningEngine/PlanningEngine';
import ShipmentsUpload from './shipmentsupload/ShipmentsUpload';

function PlanningShipmentsUpload() {
  const history = useHistory();
  const appDispatch = useDispatch();
  const [engineConfig, setEngineConfig] = React.useState([]);
  const [engineConfigParams, setEngineConfigParams] = React.useState({});

  React.useEffect(() => {
    appDispatch(getPlanningEngines()).then((response: any) => {
      if (response) {
        setEngineConfig(response);
      }
    })
    // eslint-disable-next-line
  }, [])

  return (
    <div>
      <div className="filter-wrap">
        <Filter
          pageTitle="Shipments"
          buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
          buttonTitle={isMobile ? " " : "Back"}
          leftIcon={<KeyboardBackspace />}
          onClick={() => {
            history.goBack();
          }}
        >
        </Filter>
      </div>
      {engineConfig.length > 0 ? <>
        <PlanningEngine
          engineConfig={engineConfig}
          setEngineConfig={setEngineConfig}
          setEngineConfigParams={setEngineConfigParams} />
        <ShipmentsUpload engineConfigParams={engineConfigParams} />
      </> : <DataNotFound />}
    </div>
  )
}

export default PlanningShipmentsUpload