import React from 'react';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from 'react-places-autocomplete';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../../redux/actions/AppActions';
import "./LocationSearchInput.css";

interface LocationSearchInputProps {
    selectedPlaceInformation?: Function
    placeHolder: string,
    handleChange: Function
    getLocationLatLong: Function
    setSuggestion: any,
    mandatory?: boolean,
    disabled?: boolean,
    label: string
    value: string,
    error?: string
}

export function LocationSearchInput(props: LocationSearchInputProps) {
    const { error, mandatory, setSuggestion, disabled } = props;
    const appDispatch = useDispatch();

    function handleSelect(address: any) {
        appDispatch(showLoader());
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                props.getLocationLatLong(latLng, address);
                appDispatch(hideLoader());
            })
            .catch(error => {
                appDispatch(hideLoader());
                console.error('Error', error)
            });
    };
    const searchOptions = {
        componentRestrictions: { country: ['in'] },
        // types: ['address']
    }

    return (
        <div className="location-search-wrap">
            <label>{props.label}
                {mandatory && <span className="mandatory-flied">*</span>}
            </label>
            <PlacesAutocomplete
                value={props.value}
                onChange={(address: any) => props.handleChange(address)}
                onSelect={handleSelect}
                searchOptions={searchOptions}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        <input
                            {...getInputProps({
                                placeholder: props.placeHolder,
                                disabled: disabled,
                                className: 'location-search-input form-control',
                            })}
                        />
                        <div className="autocomplete-dropdown-container">
                            {loading && <div>Loading...</div>}
                            {suggestions.map((suggestion, index) => {
                                const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                // inline style for demonstration purpose
                                const style = suggestion.active
                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                return (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setSuggestion(suggestion);
                                        }}>
                                        <div
                                            {...getSuggestionItemProps(suggestion, {
                                                className,
                                                style,
                                            })}

                                        >
                                            {suggestion.description}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
            {error && <label className="error"
            >{error}</label>}
        </div>
    );
}
