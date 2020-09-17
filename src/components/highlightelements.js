// Helper functions to highlight nodes and edges
// Will highlight/unhighlight nodes based on selectedNodes dictionary
import { isEdge } from "react-flow-renderer";

const selectedEdgeAnimated = {
    stroke: "#e94646",
    strokeWidth: 2,
    opacity: 1,
    transition: "0.3s ease"
}
const selectedEdgeStatic = {
    stroke: "#454545",
    strokeWidth: 2,
    opacity: 1,
    transition: "0.3s ease"
}

const hoverEdge = {
    stroke: "#e94646",
    strokeWidth: 2,
    opacity: 1,
    transition: "0.3s ease"
}

const potentialHoverEdge = {
    stroke: "#e94646",
    strokeWidth: 2,
    opacity: 1,
    transition: "0.3s ease"
}
const potentialEdge = {
    stroke: "#cecece",
    strokeWidth: 1,
    opacity: 1,
    transition: "0.3s ease"
}

const unselectedEdge = {
    stroke: "#cecece",
    strokeWidth: 1,
    opacity: 1,
    transition: "0.3s ease"
}

export default function highlightElements(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges) {
    // console.log("=================");
    // console.log(selectedNodes);
    // console.log(selectedEdges);
    // console.log(selectableNodes);
    // console.log(potentialEdges);
    const newElements = elements.map((e) => {
        // It is an edge
        if (isEdge(e)) {
            if (selectedEdges.hasOwnProperty(e.id)) {
                if (hoverEdges.hasOwnProperty(e.id)) return {...e, style: selectedEdgeAnimated, animated: true};
                else return {...e, style: selectedEdgeStatic, animated: false};
            } else if (potentialEdges.hasOwnProperty(e.id)) {
                if (hoverEdges.hasOwnProperty(e.id)) return {...e, style: potentialHoverEdge, animated: true};
                else return {...e, style: potentialEdge, animated: false};
            } else if (hoverEdges.hasOwnProperty(e.id)) {
                return {...e, style: hoverEdge, animated: true};
            } else {
                return {...e, style: unselectedEdge, animated: false};
            }
        }

        // It is a node
        if (selectedNodes.hasOwnProperty(e.id)) {
            // SELECTED NODE
            return {...e, style: {...e.style, color: e.textSelectedColour, background: e.selectedColour}};
        } else if (selectableNodes.hasOwnProperty(e.id)) {
            // NOT SELECTED BUT CAN BE SELECTED
            // console.log(e.textColour);
            return {...e, style: {...e.style, color: e.textColour, background: e.selectableColour}};
        } else {
            // UNSELECTED NODE
            return {...e, style: {...e.style, color: e.textColour, background: 'white'}};
        }
    })

    return newElements;
}