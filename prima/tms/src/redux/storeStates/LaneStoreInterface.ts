export interface LaneState {
    openFilter: boolean,
    openBulkUploadWithSOB: boolean,
    openBulkUploadWithLane: boolean,
    refreshList: boolean,
    selectedItem: LaneDetails | undefined,
    pagination: any,
    listData: Array<LaneDetails> | undefined,
    openModal: boolean,
    currentPage: number,
    pageSize: number,
    openPointModal: boolean,
    loading: boolean,
    filterParams: any,
    filterChips: any,
}

export interface LaneDetails {
    origin: any,
    destination: any,
    tat: number,
    laneCode: string,
    waypoints: any
    partner?: LanePartners
}

interface LanePartners {
    laneCode: string,
    partner: Array<LanePartnerDetails>
}

interface LanePartnerDetails {
    level: number,
    partnerCode: string,
    partnerName: string,
}