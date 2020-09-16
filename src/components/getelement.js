// Given an id, returns the element
const getElement = (id, elementsData) => {
    //console.log("GET ELEMENT OF " + id);
    for (var e of elementsData) {
        if (e.id === id) {
            return e;
        }
    }
    return null;
}

export default getElement;