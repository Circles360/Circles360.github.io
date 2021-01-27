// HELPER FUNCTION to initialise hidden nodes and edges of a map
import {isNode} from 'react-flow-renderer';

export default function hiddenInit(elements, exclusionGroups, exclusionNodes, hiddenNodes, hiddenEdges) {
    // Keep track of exclusion nodes for easier look up later on
    for (const group of exclusionGroups) {
        for (const exclusion of group) {
            exclusionNodes[exclusion] = 1;
        }
    }

    // Hide all exclusion nodes except for one
    for (const group of exclusionGroups) {
        const last = group.pop();
        for (var course of elements) {
            if (last === course.id) {
                hiddenNodes[course.id] = 1;
                for (const edge of elements) {
                    if (isNode(edge)) continue;
                    if (edge.source === last || edge.target == last) {
                        hiddenEdges[edge.id] = 1;
                    }
                }
                break;
            }
        }
        group.push(last);
    }
}