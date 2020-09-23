import axios from 'axios';
import urls from './urls';

export default class Search {
    constructor(query) {
        this._query = query;
        this._results = [];
        this._fetched = false;
    }

    async getResults() {
        if (!this._fetched) {
            this._results = await this._fetchResults();
            this._fetched = true;
        }
        return this._results;
    }

    async _fetchResults() {
        // Axios is similar to fetch, but
        // 1. Supported in more browsers
        // 2. Will immediately return JSON while in fetch it's a two step process
        try {
            const result = await axios(urls.queryUrl(this._query));     
            return result.data.recipes;
        }
        catch (error) {
            // 400 also happens in case there are no results
            if ((""+error).includes('400')) {
                console.log(`No results for '${this._query}'. No known menus for this search string in database`);
            }
            else {
                console.log(`Could not retrieve results for '${this._query}': ${error}`);
            } 
            return [];
        }

    }
}




