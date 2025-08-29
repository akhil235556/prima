import { Card, CardContent, CardHeader } from "@material-ui/core";
import { ExpandLess, KeyboardBackspace } from '@material-ui/icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { zoneCards } from "../../../base/constant/ArrayList";
import { isMobile } from '../../../base/utility/ViewUtils';
import Chips from '../../../component/chips/Chips';
import Filter from '../../../component/filter/Filter';
import Information from '../../../component/information/Information';
import PageContainer from '../../../component/pageContainer/PageContainer';
import { getZoneDetails } from "../../../serviceActions/ZoneServiceActions";
import "./ZoneWrapper.css";

const ZoneWrapper = () => {
    const history = useHistory();
    const appDispatch = useDispatch();
    const { id }: any = useParams();
    const [isCollapsed, setIsCollapsed] = React.useState<Array<boolean>>([false, false, true]);
    const [zoneDetails, setZoneDetails] = React.useState<any>();

    useEffect(() => {
        if (id) {
            appDispatch(getZoneDetails({ zoneCode: id })).then((response: any) => {
                if (response) {
                    setZoneDetails(response);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    function onCollapse(index: any) {
        if (index !== 2) {
            isCollapsed[index] = !isCollapsed[index];
            setIsCollapsed([...isCollapsed]);
        }
    }

    return (
        <div className="zone">
            <div className="filter-wrap">
                <Filter
                    pageTitle={`${"Zone ID : " + (zoneDetails?.zoneCode || "NA")}`}
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        history.goBack();
                    }}
                >
                </Filter >
            </div>
            <PageContainer>
                <Card className="creat-contract-wrapp creat-wrapp">
                    <CardHeader className="creat-contract-header"
                        title="Zone Details"
                    />
                    <CardContent className="creat-contract-content">
                        <div className="custom-form-row row align-items-end">
                            <div className="form-group col-md-3">
                                <Information
                                    title={'Transporter'}
                                    text={zoneDetails?.partnerName}
                                />
                            </div>
                            <div className="form-group col-md-3">
                                <Information
                                    title={'Zone Name'}
                                    text={zoneDetails?.zoneName}
                                />
                            </div>
                            <div className="form-group col-md-3">
                                <Information
                                    title={'Mapping'}
                                    text={zoneDetails?.mappingType}
                                />
                            </div>
                            <div className="form-group col-md-3">
                                <Information
                                    title={'Description'}
                                    text={zoneDetails?.zoneDescription}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {zoneCards?.map((card: any, index: any) =>
                    <Card key={index} className="creat-contract-wrapp creat-wrapp">
                        <CardHeader className="creat-contract-header"
                            title={card?.title}
                        />
                        <div className="expandBtn-card">
                            <button onClick={() => onCollapse(index)}>{isCollapsed?.[index] ? <ExpandMoreIcon /> : <ExpandLess />}</button>
                        </div>
                        {isCollapsed?.[index] &&
                            <CardContent className="creat-contract-content">
                                <div className="custom-form-row row align-items-end">
                                    <div className='form-group chips-grey'>
                                        {zoneDetails?.zoneLocation?.[0]?.[card?.key]?.map((item: any, idx: any) => <Chips key={idx} label={item?.[card?.childKey]} />)}
                                    </div>
                                </div>
                            </CardContent>
                        }
                    </Card>)}
            </PageContainer>

        </div>
    )
}

export default ZoneWrapper;