// HELPER FUNCTION to update coursesJSON with dataJSON
export default function coursesInit(rawCoursesJSON, dataJSON) {
    var coursesJSON = {...rawCoursesJSON};
    dataJSON.forEach(course => {
        if (!coursesJSON.hasOwnProperty(course.id)) return;
        coursesJSON[course.id].conditions = {...course.data.conditions};
        coursesJSON[course.id].terms = course.data.terms;
    });

    return coursesJSON
}