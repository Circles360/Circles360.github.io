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

export default function highlightElements(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges, hiddenNodes, hiddenEdges, hideMap) {
    const newElements = elements.map((e) => {
        // It is an edge
        if (isEdge(e)) {
            if (selectedEdges.hasOwnProperty(e.id)) {
                // Show selected edges (no matter what?)
                if (hiddenEdges.hasOwnProperty(e.id)) e.isHidden = true;
                else e.isHidden = false;

                if (hoverEdges.hasOwnProperty(e.id)) return {...e, style: selectedEdgeAnimated, animated: true};
                else return {...e, style: selectedEdgeStatic, animated: false};
            } else if (potentialEdges.hasOwnProperty(e.id)) {
                // Do not show potential edges in hide map
                if (hiddenEdges.hasOwnProperty(e.id) || hideMap === true) e.isHidden = true;
                else e.isHidden = false;

                if (hoverEdges.hasOwnProperty(e.id)) return {...e, style: potentialHoverEdge, animated: true};
                else return {...e, style: potentialEdge, animated: false};
            } else if (hoverEdges.hasOwnProperty(e.id)) {
                // TODO: Do we need a condition here?
                return {...e, style: hoverEdge, animated: true};
            } else {
                // Hide useless edges if hideMap
                if (hideMap === true || hiddenEdges.hasOwnProperty(e.id)) e.isHidden = true;
                else e.isHidden = false;
                return {...e, style: unselectedEdge, animated: false};
            }
        }

        // It is a node
        if (selectedNodes.hasOwnProperty(e.id)) {
            // Show selected nodes (no matter what?)
            if (hiddenNodes.hasOwnProperty(e.id)) e.isHidden = true;
            else e.isHidden = false;

            return {...e, style: {...e.style, color: e.textSelectedColour, background: e.selectedColour}};
        } else if (selectableNodes.hasOwnProperty(e.id)) {
            // Show selectable nodes whenever possible
            if (hiddenNodes.hasOwnProperty(e.id)) e.isHidden = true;
            else e.isHidden = false;

            return {...e, style: {...e.style, color: e.textColour, background: e.selectableColour}};
        } else {
            // Hide unselected nodes when necessary
            if (hideMap === true || hiddenNodes.hasOwnProperty(e.id)) e.isHidden = true;
            else e.isHidden = false;
            return {...e, style: {...e.style, color: e.textColour, background: 'white'}};
        }
    })

    return newElements;
}