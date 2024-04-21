export const filterExtractor = (query: any) => {
    const filteredQuery = {};
    for (const key in query) {
        if (query[key] !== '') {
            filteredQuery[key] = query[key];}
    }
    return filteredQuery;
};