// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ChangeEvent, FormEvent, useEffect, useRef} from 'react';

import Constants from 'utils/constants';
import * as Utils from 'utils/utils.jsx';
import SearchSuggestionList from 'components/suggestion/search_suggestion_list.jsx';
import SuggestionDate from 'components/suggestion/suggestion_date.jsx';
import SuggestionBox from 'components/suggestion/suggestion_box.jsx';
import LoadingSpinner from 'components/widgets/loading/loading_spinner';

const {KeyCodes} = Constants;

const style = {
    searchForm: {overflow: 'visible'},
};

type Props = {
    searchTerms: string,
    updateHighlightedSearchHint: (indexDelta: number, changedViaKeyPress?: boolean) => void,
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void,
    handleEnterKey: (e: ChangeEvent<HTMLInputElement>) => void,
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void,
    handleClear: () => void,
    handleFocus: () => void,
    handleBlur: () => void,
    keepFocussed: boolean,
    isFocussed: boolean,
    suggestionProviders: [],
    isSearchingTerm: boolean,
    isSideBarRight: boolean,
    isFocus: boolean,
    getFocus: (searchBarFocus: () => void) => void,
    children?: React.ReactNode,
}

const SearchBar: React.FunctionComponent<Props> = (props: Props): JSX.Element => {
    const {isFocussed, keepFocussed, searchTerms, suggestionProviders} = props;

    const searchRef = useRef<SuggestionBox>();

    useEffect((): void => {
        // let redux handle changes before setting focus again to the input
        if (isFocussed || keepFocussed) {
            setTimeout(() => searchRef.current?.focus(), 0);
        } else {
            setTimeout(() => searchRef.current?.blur(), 0);
        }
    }, [searchTerms, isFocussed]);

    const handleKeyDown = (e: ChangeEvent<HTMLInputElement>): void => {
        if (Utils.isKeyPressed(e, KeyCodes.ESCAPE)) {
            searchRef.current?.blur();
            e.stopPropagation();
            e.preventDefault();
        }

        if (Utils.isKeyPressed(e, KeyCodes.DOWN)) {
            e.preventDefault();
            props.updateHighlightedSearchHint(1, true);
        }

        if (Utils.isKeyPressed(e, KeyCodes.UP)) {
            e.preventDefault();
            props.updateHighlightedSearchHint(-1, true);
        }

        if (Utils.isKeyPressed(e, KeyCodes.ENTER)) {
            e.preventDefault();
            props.handleEnterKey(e);
        }
    };

    const getSearch = (node: SuggestionBox): void => {
        searchRef.current = node;
        if (props.getFocus) {
            props.getFocus(props.handleFocus);
        }
    };

    const searchFormClass = `search__form${isFocussed ? ' search__form--focused' : ''}`;

    return (
        <div
            id={props.isSideBarRight ? 'sbrSearchFormContainer' : 'searchFormContainer'}
            className='search-form__container'
        >
            <form
                role='application'
                className={searchFormClass}
                onSubmit={props.handleSubmit}
                style={style.searchForm}
                autoComplete='off'
                aria-labelledby='searchBox'
            >
                <div className='search__font-icon TEST'>
                    <i className='icon icon-magnify icon-16'/>
                </div>
                <SuggestionBox
                    ref={getSearch}
                    id={props.isSideBarRight ? 'sbrSearchBox' : 'searchBox'}
                    tabIndex='0'
                    className='search-bar a11y__region'
                    containerClass='w-full'
                    data-a11y-sort-order='9'
                    aria-describedby={props.isSideBarRight ? 'sbr-searchbar-help-popup' : 'searchbar-help-popup'}
                    aria-label={Utils.localizeMessage('search_bar.search', 'Search')}
                    placeholder={Utils.localizeMessage('search_bar.search', 'Search')}
                    value={props.searchTerms}
                    onFocus={props.handleFocus}
                    onBlur={props.handleBlur}
                    onChange={props.handleChange}
                    onKeyDown={handleKeyDown}
                    listComponent={SearchSuggestionList}
                    dateComponent={SuggestionDate}
                    providers={suggestionProviders}
                    type='search'
                    autoFocus={props.isFocus && searchTerms === ''}
                    delayInputUpdate={true}
                    renderDividers={true}
                    clearable={true}
                    onClear={props.handleClear}
                />
                {props.isSearchingTerm && <LoadingSpinner/>}
                {props.children}
            </form>
        </div>
    );
};

export default SearchBar;
