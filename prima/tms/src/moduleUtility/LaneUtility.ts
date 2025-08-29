import { LaneDetails } from '../redux/storeStates/LaneStoreInterface';
export const laneElementData: LaneDetails = {
    origin: "",
    destination: "",
    tat: 0,
    waypoints: "",
    laneCode: "",
    partner: {
        laneCode: "",
        partner: [{
            partnerCode: "",
            partnerName: "",
            level: 1,
        }]
    }
};
