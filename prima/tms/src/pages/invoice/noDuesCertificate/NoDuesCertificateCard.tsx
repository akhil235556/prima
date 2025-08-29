import React, { useEffect } from 'react'
import "./NoDuesCertificateCard.css";
import { KeyboardBackspace } from "@material-ui/icons";
import Filter from '../../../component/filter/Filter';
import { useHistory, useParams } from 'react-router-dom';
import PageContainer from '../../../component/pageContainer/PageContainer';
import { useDispatch } from 'react-redux';
import { getNoDues } from '../../../serviceActions/BillGenerateServiceActions';
import { convertDateFormat, displayDateFormatter } from '../../../base/utility/DateUtils';


function NoDuesCertificateCard() {
    let history = useHistory();
    const { id } = useParams();
    const appDispatch = useDispatch();
    const [response, setResponse] = React.useState<any>({});

    useEffect(() => {
        const getPartnerNoDues = async () => {
            appDispatch(getNoDues({ partnerCode: id })).then((response: any) => {
                if (response) {
                    setResponse(response);
                }
            });
        }
        id && getPartnerNoDues();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="cert-detail-wrap">
            <Filter
                pageTitle="No Dues Certificates"
                buttonStyle="btn-detail"
                buttonTitle="Back"
                leftIcon={<KeyboardBackspace />}
                onClick={() => {
                    history.goBack();
                }}
            />
            <PageContainer>
                <div className="row">
                    <div className="col-12 certificate-detail">
                        <h4>To,</h4>
                        <p className="m-0">{response.companyName}</p>
                        <span>{response.address}</span>
                        <h4 className="blue-text">Sub - No Dues Certificates</h4>
                        <p>Dear Sir,</p>
                        <p>{"I hereby state that there is Rs." + response.amount ? response.amount : 0 + "dues left with ‘" + response.companyName + "’"}
                            <br className="d-md-block d-none" /> {"My full & final settlement done by company on " + convertDateFormat(new Date(), displayDateFormatter) + "."}
                        </p>
                    </div>
                </div>
            </PageContainer>
        </div>
    )
}
export default NoDuesCertificateCard;