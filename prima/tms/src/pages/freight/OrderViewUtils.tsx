import React from 'react';
import { address, areaOfficeLabel, balanceQtyLabel, blockLabel, companyName, consigneeLocation, consigneeName, createdAtLabel, dispatchQtyLabel, districtLabel, errorQuantityZero, expiredAtLabel, gstNumber, remarkLabel, sourceNumberLabel, TotalQtyLabel, uomLabel, zoneLabel } from '../../base/constant/MessageUtils';
import { convertDateFormat, displayDateTimeFormatter } from '../../base/utility/DateUtils';
import { isMobile } from '../../base/utility/ViewUtils';
import Information from '../../component/information/Information';
import { CustomToolTip } from '../../component/widgets/CustomToolTip';
import { InfoTooltip } from '../../component/widgets/tooltip/InfoTooltip';

interface OrderViewProps {
    selectedIndex: any,
    element: any
}

function OrderViewUtils(props: OrderViewProps) {
    const { element, selectedIndex } = props;
    const eclipseLength = isMobile ? 6 : 28;

    function pageContent(index: any, item: any) {
        switch (index) {
            case 0:
                return (
                    <div className="custom-form-row row">
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={sourceNumberLabel}
                                customView={
                                    <InfoTooltip
                                        title={item.sourceNumber || "....."}
                                        placement={"top"}
                                        disableInMobile={"false"}
                                        infoText={item.sourceNumber || "....."}
                                    />
                                }
                            />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={TotalQtyLabel}
                                text={item.quantity || "....."}
                            />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={uomLabel}
                                text={item.unit || "....."}
                            />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={balanceQtyLabel}
                                text={item.balanceQuantity || (item.quantity ? errorQuantityZero : ".....")}
                            />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={dispatchQtyLabel}
                                text={item.dispatchQuantity || (item.quantity ? errorQuantityZero : ".....")}
                            />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={createdAtLabel}
                                text={(item.createdAt && convertDateFormat(item.createdAt, displayDateTimeFormatter)) || "....."}
                            />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={expiredAtLabel}
                                text={(item.createdAt && convertDateFormat(item.endDateTime, displayDateTimeFormatter)) || "....."}
                            />
                        </div>
                        <div className="labelWidth col-md-3 billing-group col-6">
                            <Information
                                title={remarkLabel}
                                customView={
                                    <div className="d-flex ">
                                        <p>{item.remark || "....."}</p>
                                        {
                                            item.remark &&
                                            item.remark.length >= eclipseLength &&
                                            <CustomToolTip
                                                title={item.remark}
                                                placement={"top"}
                                                disableInMobile={"false"}
                                            >
                                                <span className="blue-text">more</span>
                                            </CustomToolTip>
                                        }
                                    </div>
                                }
                            />
                        </div>
                    </div>);
            case 1:
                return (
                    <div className="custom-form-row row">
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={companyName}
                                customView={
                                    <InfoTooltip
                                        title={item.companyName || "....."}
                                        placement={"top"}
                                        disableInMobile={"false"}
                                        infoText={item.companyName || "....."}
                                    />
                                }
                            />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={gstNumber}
                                customView={
                                    <InfoTooltip
                                        title={item.vendorGstNumber || "....."}
                                        placement={"top"}
                                        disableInMobile={"false"}
                                        infoText={item.vendorGstNumber || "....."}
                                    />
                                }
                            />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={address}
                                customView={
                                    <InfoTooltip
                                        title={item.address || "....."}
                                        placement={"top"}
                                        disableInMobile={"false"}
                                        infoText={item.address || "....."}
                                    />
                                }
                            />
                        </div>
                    </div>);
            case 2:
                return (
                    <div className="custom-form-row row">
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={consigneeName}
                                customView={
                                    <InfoTooltip
                                        title={item.consigneeName || "....."}
                                        placement={"top"}
                                        disableInMobile={"false"}
                                        infoText={item.consigneeName || "....."}
                                    />
                                }
                            />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={consigneeLocation}
                                customView={
                                    <InfoTooltip
                                        title={item.locationName || "....."}
                                        placement={"top"}
                                        disableInMobile={"false"}
                                        infoText={item.locationName || "....."}
                                    />
                                }
                            />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={districtLabel}
                                text={item.district || "....."}
                                customView={
                                    <InfoTooltip
                                        title={item.district || "....."}
                                        placement={"top"}
                                        disableInMobile={"false"}
                                        infoText={item.district || "....."}
                                    />
                                }
                            />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={blockLabel}
                                text={item.taluka || "....."}
                                customView={
                                    <InfoTooltip
                                        title={item.taluka || "....."}
                                        placement={"top"}
                                        disableInMobile={"false"}
                                        infoText={item.taluka || "....."}
                                    />
                                }
                            />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={areaOfficeLabel}
                                text={item.areaOffice || "....."}
                                customView={
                                    <InfoTooltip
                                        title={item.areaOffice || "....."}
                                        placement={"top"}
                                        disableInMobile={"false"}
                                        infoText={item.areaOffice || "....."}
                                    />
                                }
                            />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={zoneLabel}
                                text={item.zone || "....."}
                                customView={
                                    <InfoTooltip
                                        title={item.zone || "....."}
                                        placement={"top"}
                                        disableInMobile={"false"}
                                        infoText={item.zone || "....."}
                                    />
                                }
                            />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={gstNumber}
                                customView={
                                    <InfoTooltip
                                        title={item.consigneeGstNumber || "....."}
                                        placement={"top"}
                                        disableInMobile={"false"}
                                        infoText={item.consigneeGstNumber || "....."}
                                    />
                                }
                            />
                        </div>
                    </div>);
            default: break;

        }
    };
    return (
        <React.Fragment>
            {pageContent(selectedIndex, element)}
        </React.Fragment>
    );
};

export default OrderViewUtils;