import { useHistory } from "react-router-dom";
import { createQueryParams, getFilterChipsAndParams, useQuery } from "../utility/Routerutils";

export function useSearchParams(filterKeySet: any) {
    const params = useQuery();
    const history = useHistory();
    const filterState: any = getFilterChipsAndParams(params, filterKeySet);
    function addFiltersQueryParams(filterChips: any, filterParams: any) {
        let appliedFilters = createQueryParams(params, filterChips, filterParams, filterKeySet);
        history.replace({
            pathname: history.location.pathname,
            search: appliedFilters.toString()
        });
    }

    function removeFiltersQueryParams(filterKeys: Array<any>) {
        // eslint-disable-next-line
        filterKeys && filterKeys.map((element: any) => {
            params.delete(element);
            params.delete(filterKeySet[element]);
        })
        history.replace({
            pathname: history.location.pathname,
            search: params.toString()
        });
    }

    return [filterState, addFiltersQueryParams, removeFiltersQueryParams];
}