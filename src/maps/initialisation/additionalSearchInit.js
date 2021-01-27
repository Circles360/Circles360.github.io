// HELPER FUNCTION to initialise search for nodes not on the flowchart
export default function additionalSearchInit(dataJSON, coursesJSON, searchAdditionalOptions) {
    const nodesOnFlowchart = dataJSON.map(node => node.id);
    for (const course in coursesJSON) {
        if (!coursesJSON.hasOwnProperty(course)) continue;
        if (nodesOnFlowchart.includes(course)) continue;

        searchAdditionalOptions.push({
            key: course,
            value: course,
            text: course + ' - ' + coursesJSON[course].course_name
        });
    }
}