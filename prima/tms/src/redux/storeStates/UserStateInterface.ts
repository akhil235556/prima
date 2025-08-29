export interface UserState {
    openFilter: boolean,
    refreshList: boolean,
    loading: boolean,
    openModal: boolean,
    selectedItem: UserDetails | undefined,
    pagination: any
    listData: Array<UserDetails> | undefined,
    currentPage: number,
    pageSize: number,
    searchQuery: string,
    filterParams: any,
    filterChips: any,
}

export interface UserDetails {
    email: string,
    phoneNumber: string,
    name: string,
    userId?: string,
    username: string,
    nickname?: string,
    password?: string,
    displayPicture?: string
}