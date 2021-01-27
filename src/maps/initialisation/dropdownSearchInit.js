// HELPER FUNCTION to initialise dropdown search list
// Modifies a given list to contain all the options for search
import {isNode} from 'react-flow-renderer';
export default function dropdownSearchInit(elements, specialisations, dropdownSearch) {
    for (const course of elements) {
        if (specialisations.includes(course.id)) continue;
        if (isNode(course)) {
            dropdownSearch.push({
                key: course.id,
                value: course.id,
                text: course.id + ' - ' + course.data.course_name
            });
        }
    }
}