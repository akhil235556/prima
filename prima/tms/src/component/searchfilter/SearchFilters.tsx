import { ClearAll, Search } from "@material-ui/icons";
import React, { useEffect } from "react";
import { isNullValue } from "../../base/utility/StringUtils";
import { isMobile } from "../../base/utility/ViewUtils";
import AutoComplete from "../widgets/AutoComplete";
import Button from "../widgets/button/Button";
import EditText from "../widgets/EditText";
import { OptionType } from "../widgets/widgetsInterfaces";
import "./searchFilter.css";

interface SearchFilterProps {
    onClickSearch?: any,
    list: any
    appliedFilters?: any,
    children?: any,
}

function SearchFilter(props: SearchFilterProps) {
    const { onClickSearch, list, appliedFilters, children } = props;
    const [params, setParams] = React.useState<any | undefined>(undefined);
    const [error, setError] = React.useState<any>({});
    const [searchApplied, setSearchApplied] = React.useState<boolean>(false);

    useEffect(() => {
        if (appliedFilters) {
            appliedFilters.queryFieldLabel && setSearchApplied(true);
            setParams({
                field: appliedFilters.queryFieldLabel ? {
                    label: appliedFilters.queryFieldLabel,
                    value: appliedFilters.queryField,
                } : null,
                text: appliedFilters.query
            })
            setError({});
        } else {
            setParams({});
            setError({});
        }
        // eslint-disable-next-line
    }, [appliedFilters])

    return (
        <div className="search-filter-wrap">
            <div className="container-fluid">
                <div className="row align-items-center">
                    {!isMobile && <div className="col-auto pr-md-0"><span className="filter-label">Filter:</span></div>}
                    <div className="col">
                        <div className="row align-items-center">
                            <div className="col-md-3 pr-md-0">

                                <AutoComplete
                                    label=""
                                    placeHolder="Select Field"
                                    error={error.field}
                                    value={params && params.field}
                                    options={list}
                                    onChange={(value: OptionType) => {
                                        setParams({
                                            ...params,
                                            field: value,
                                            text: ""
                                        })
                                        setError({})
                                    }}
                                />
                            </div>

                            <div className="col-md-3 pr-md-0">
                                <EditText
                                    placeholder="Search"
                                    value={params && params.text}
                                    maxLength={50}
                                    error={error.text}
                                    onChange={(text: any) => {
                                        setParams({
                                            ...params,
                                            text: text
                                        })
                                        setError({})
                                    }}
                                />

                            </div>

                            <div className="col-md-2 search-btn">
                                <div className="d-flex">
                                    <Button
                                        title={isMobile ? "" : "Search"}
                                        buttonStyle="mr-2 btn-gray"
                                        leftIcon={<Search />}
                                        onClick={() => {
                                            if (validate()) {
                                                if (params && params.field && params.text && params.text.length > 0) {
                                                    setSearchApplied(true);
                                                    setError({})
                                                    onClickSearch(params);
                                                }
                                            }
                                        }}
                                    />
                                    <Button
                                        title={isMobile ? "" : "Clear"}
                                        buttonStyle="btn-gray orange-text"
                                        onClick={() => {
                                            setParams(undefined);
                                            setSearchApplied(false);
                                            setError({})
                                            if (searchApplied) {
                                                onClickSearch(undefined);
                                            }
                                        }}
                                        leftIcon={<ClearAll />}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );

    function validate() {
        if (!params || isNullValue(params.field)) {
            setError({
                field: "Select Field"
            })
            return false
        } else if (!params || isNullValue(params.text)) {
            setError({
                text: "Enter " + params.field.label
            });
            return false;
        }
        return true;
    }
};

export default SearchFilter;