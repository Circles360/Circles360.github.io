import {isNode} from 'react-flow-renderer';

// HELPER FUNCTION FOR POSITIONING
// Prints out positions of all nodes
export default function positionHelper(elements, elementsData) {
    var positioning_data = [];
    for (const e of elements) {
        if (isNode(e)) {
            positioning_data.push({
                id: e.id,
                position: {x: e.position.x, y: e.position.y},
            });
        }
    }
    // Write data to position output file. Note we have to do this ourselves as we
    // are making a server write to a local file.
    console.log('[');
    for (const e of positioning_data) {
        console.log('{"id": "' + e.id + '", "position": {"x": ' + e.position.x + ', "y": ' + e.position.y + '}},');
    }
    console.log(']');
}