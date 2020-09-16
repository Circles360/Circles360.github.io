import coursesJSON from '../webscraper/courses_with_data.json';

// Given an id, returns the element
const getAllElement = (id, elementsData) => {
    //console.log("GET ELEMENT OF " + id);
    for (var e of elementsData) {
        if (e.id === id) {
            return e;
        }
    }

    if (! coursesJSON.hasOwnProperty(id)) return null;
    
    return coursesJSON[id];
}

export default getAllElement;