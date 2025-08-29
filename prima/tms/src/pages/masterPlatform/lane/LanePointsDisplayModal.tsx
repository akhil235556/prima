import Skeleton from "@material-ui/lab/Skeleton";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import LaneStepper from "../../../component/widgets/LaneStepper";
import ModalContainer from "../../../modals/ModalContainer";
import { searchV1Lane } from "../../../serviceActions/LaneServiceActions";
import './LaneStepperModal.css';

interface CreateLaneModalProps {
    open: boolean
    onClose: any
    laneCode?: string,

}

function LanePointsDisplayModal(props: CreateLaneModalProps) {
    const { open, onClose, laneCode } = props;
    const appDispatch = useDispatch();
    const [loading, setLoading] = React.useState<boolean>(true);
    const [steps, setSteps] = React.useState<Array<any>>([]);
    const wayPointsList: any = [];

    useEffect(() => {
        const getLaneDetails = async () => {
            appDispatch(searchV1Lane({ query: laneCode })).then((response: any) => {
                if (response && response.length > 0) {
                    wayPointsList.push({ address: response[0].origin.name, node: response[0].origin.node })
                    if (response[0] && response[0].waypoints) {
                        response[0].waypoints.map((item: any) => (wayPointsList.push({ address: item.name, node: item.node })));
                    }
                    wayPointsList.push({ address: response[0].destination.name, node: response[0].destination.node })

                }
                setLoading(false);
                setSteps(wayPointsList);
            });
        };
        open && laneCode && getLaneDetails();
        // eslint-disable-next-line
    }, [open]);

    return (
        <ModalContainer
            title="Lane Details"
            open={open}
            onClose={() => {
                setSteps([]);
                setLoading(true);
                onClose();
            }}
            onClear={null}
            styleName="way-point-modal"
        >

            <div className="custom-stepper way-point-stepper">
                {loading ? <div className="row skeleton-progress">
                    {[1, 2, 3, 4].map((element: any, index: number) => (
                        <div className="d-flex col-12 align-items-center mb-5" key={index}>
                            <Skeleton animation="wave" variant="circle" width={11} height={11} style={{ marginRight: 20, borderRadius: 50 }} />
                            <div
                                style={{
                                    width: "100%"
                                }}
                            >
                                <Skeleton animation="wave" height={10} width="50%" style={{ borderRadius: 50 }} />
                                <Skeleton animation="wave" height={10} width="50%" style={{ borderRadius: 50 }} />
                            </div>
                        </div>
                    ))}
                </div> :
                    <LaneStepper
                        steps={steps}
                    />
                }
            </div>
        </ModalContainer >
    );

}

export default LanePointsDisplayModal;
