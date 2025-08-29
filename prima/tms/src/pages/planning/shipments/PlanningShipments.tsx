import { AddCircle } from '@material-ui/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { PlanningShipmentsUploadUrl } from '../../../base/constant/RoutePath';
import { isMobile } from "../../../base/utility/ViewUtils";
import DataNotFound from '../../../component/error/DataNotFound';
import Filter from '../../../component/filter/Filter';
import PageContainer from "../../../component/pageContainer/PageContainer";
import Button from '../../../component/widgets/button/Button';

function PlanningShipments() {
    const history = useHistory();
    return (
        <div>
            <Filter
                pageTitle="Shipments"
            >
                <Button
                    buttonStyle={isMobile ? "mobile-create-btn" : "btn-blue"}
                    title={isMobile ? "" : "Create Plan"}
                    //loading={state.loading}
                    leftIcon={isMobile ? <img src="/images/Add.png" alt="Enable " /> : <AddCircle />}
                    onClick={() => {
                        history.push({
                            pathname: PlanningShipmentsUploadUrl,
                        })
                    }}
                />
            </Filter>
            <PageContainer>
                <div className="imageCard">
                    <DataNotFound />
                </div>
            </PageContainer>
        </div>
    )
}

export default PlanningShipments