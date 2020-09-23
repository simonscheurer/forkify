const apiBase = 'https://forkify-api.herokuapp.com/api/';

export default {
    queryUrl: (query) => apiBase + `search?&q=${query}`, 
    recipeUrl: (id) => apiBase + `get?rId=${id}`, 
};