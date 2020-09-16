import coursesJSON from '../webscraper/courses.json';
// Given an id, returns the element
const getElement = (id, elementsData) => {
    //console.log("GET ELEMENT OF " + id);
    for (var e of elementsData) {
        if (e.id === id) {
            return e;
        }
    }

    if (!coursesJSON.hasOwnProperty(id)) return null;

    // It exists but not on our flowchart.
    return coursesJSON[id];
}

export default getElement;