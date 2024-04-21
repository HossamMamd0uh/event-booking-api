export const filterExtractor = (query: any) => {
    let filteredQuery = {where: {}};
    for (const key in query) {
        if (query[key] !== '') {
            if (key === 'category') {
                filteredQuery.where[key] = { id: query[key] };
            }
            else{
            filteredQuery.where[key] = query[key];}
        }
    }
    return filteredQuery;
};