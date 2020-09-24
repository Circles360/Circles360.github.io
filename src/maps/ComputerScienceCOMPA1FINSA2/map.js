import React, {useState, useRef} from 'react';
import ReactFlow, { isNode, isEdge, ReactFlowProvider } from 'react-flow-renderer';

import CustomNode1 from '../../components/customnode1.js';
import CustomNode2 from '../../components/customnode2.js';
import HeaderNode1 from '../../components/headernode1.js';

import HoverInfo from '../../components/hoverinfo.js';
import hoverPrerequisites from '../../components/hoverprerequisites.js';
import unhoverPrerequisites from '../../components/unhoverprerequisites.js';

import { Grid, Segment, Container, Dropdown, Header, Checkbox } from 'semantic-ui-react'
import Sidebar from "../../components/sidebar.js"

import DegreePlanner from "../../components/degreeplanner.js"
import DropdownSearch from "../../components/dropdownsearch.js"

// Initialisation helper functions
import dropdownSearchInit from '../../components/initialisation/dropdownSearchInit';
import selectableInit from '../../components/initialisation/selectableInit';
import hiddenInit from '../../components/initialisation/hiddenInit';
import additionalSearchInit from '../../components/initialisation/additionalSearchInit';
import coursesInit from '../../components/initialisation/coursesInit';

// import positionHelper from '../../components/positionhelper.js';
import selectNode from '../../components/selectnode.js';
import unselectNode from '../../components/unselectnode.js';
import highlightElements from '../../components/highlightelements.js';
import getSelectable from '../../components/getselectable.js';
import checkPrerequisites from '../../components/checkprerequisites';
import exclusionSwap from '../../components/exclusionswap.js';

import unselectUnconnected from '../../components/unselectunconnected.js';
import coursesJSON from "../../webscraper/courses.json";
import dataJSON from "./data.json"

const specialisations = ['COMPA1', 'FINSA2'];
const program = "3778";
const elementsData = dataJSON.slice();

// Initialise dropdown search data
var searchNodeOptions = [];
dropdownSearchInit(elementsData, specialisations, searchNodeOptions);

// Initialise dropdown degree data
var searchAdditionalOptions = [];
additionalSearchInit(dataJSON, coursesJSON, searchAdditionalOptions);

var nodesData = elementsData.filter(e => isNode(e));
var edgesData = elementsData.filter(e => isEdge(e));

var selectedNodes = {};
for (const specialisation of specialisations) selectedNodes[specialisation] = 1;

var selectedEdges = {};
var selectableNodes = {};
var potentialEdges = {};
var hoverEdges = {};
var hiddenNodes = {};
var hiddenEdges = {};

// Load up the chart with initial selectable nodes and edges
selectableInit(elementsData, nodesData, selectedNodes, selectableNodes, potentialEdges);

// Load up the chart with initial hidden nodes and edges
var exclusionGroups = require("./data_exclusion.json");
const exclusionNodes = {};
hiddenInit(elementsData, exclusionGroups, exclusionNodes, hiddenNodes, hiddenEdges);

// Update coursesJSON with dataJSON data to be passed down to degree planner
const updatedCoursesJSON = coursesInit(coursesJSON, dataJSON);

const nodeTypes = {
    custom1: CustomNode1,
    custom2: CustomNode2,
    header1: HeaderNode1
};

const layoutStyle = {overflowX: "hidden", overflowY: "overlay", width: "100vw", height: "100vh"};

const ComputerScienceCOMPA1FINSA2 = () => {
    const [elements, setElements] = useState(elementsData);
    const [hoverText, setHoverText] = useState(false);
    const [hoverNode, setHoverNode] = useState();
    const [layout, setLayout] = useState(layoutStyle);
    const [additionalCourses, setAdditionalCourses] = useState([]);

    var hideMap = useRef(true);

    var clickCount = 0;
    var singleClickTimer = '';

    const onInstanceLoad = (instance) => {
        setElements(highlightElements(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges, hiddenNodes, hiddenEdges, hideMap.current));
        instance.setTransform({x: 500, y: 680, zoom: 1});
    };

    const selectUnselect = (element) => {
        // Unhover edges which lit up on nodeMouseEnter
        unhoverPrerequisites(hoverEdges);

        // 1. Select the node and fill in edges.
        // OR Unselects the nodes and unselects all nodes which depended on that node
        if (selectableNodes.hasOwnProperty(element.id)) {
            selectNode(elements, element, selectedNodes, selectedEdges, selectableNodes, potentialEdges);
        } else if (selectedNodes.hasOwnProperty(element.id)) {
            unselectNode(elements, element, selectedNodes, selectedEdges, selectableNodes, potentialEdges);
            unselectUnconnected(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges);
        }

        // 2. Determine which nodes are now selectable
        // - Determine which previously selectable nodes are now unselectable
        getSelectable(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges);

        // Render graph accordingly
        setElements(highlightElements(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges, hiddenNodes, hiddenEdges, hideMap.current));
    }

    const toggleExclusion = (element) => {
        // TODO: ARE there courses which do not 
        // For all immediate edges of the element, swap
        // with the exclusion course
        exclusionSwap(element, elements, edgesData, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges, hiddenNodes, hiddenEdges, exclusionGroups);
        setElements(highlightElements(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges, hiddenNodes, hiddenEdges, hideMap.current));
    }


    const onElementClick = (event, element) => {
        if (isEdge(element)) return; // Don't care about edges
        if (specialisations.includes(element.id)) return; // Cannot click on main node
        if ((! selectableNodes.hasOwnProperty(element.id)) && (! selectedNodes.hasOwnProperty(element.id))) return; // Cannot select non selectable nodes

        // Determine double or single click for exclusion nodes
        // This will prevent normal nodes from waiting the double click delay
        if (exclusionNodes.hasOwnProperty(element.id)) {
            clickCount++;
            if (clickCount === 1) {
                singleClickTimer = setTimeout(function() {
                    clickCount = 0;
                    selectUnselect(element);
                }, 250);
            } else if (clickCount === 2) {
                clearTimeout(singleClickTimer);
                clickCount = 0;
                toggleExclusion(element);
            }
        } else {
            // Not an exclusion node. Cannot be doubleclicked
            selectUnselect(element);
        }
    };

    const onNodeMouseEnter = (event, node) => {
        if (specialisations.includes(node.id)) return;
        // Display node information in top left
        setHoverText(true);
        setHoverNode(node);
        hoverPrerequisites(node, elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges);
        setElements(highlightElements(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges, hiddenNodes, hiddenEdges, hideMap.current));
    }

    const onNodeMouseLeave = (event, node) => {
        if (specialisations.includes(node.id)) return;
        setHoverText(false);
        unhoverPrerequisites(hoverEdges);
        setElements(highlightElements(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges, hiddenNodes, hiddenEdges, hideMap.current));
    }

    let hoverDisplay;
    if (hoverText) {
        hoverDisplay = <HoverInfo node={hoverNode}/>
    }

    const toggleHidden = () => {
        hideMap.current = !hideMap.current;

        setElements(highlightElements(elements, selectedNodes, selectedEdges, selectableNodes, potentialEdges, hoverEdges, hiddenNodes, hiddenEdges, hideMap.current));
    }

    // const onNodeDragStop = (event, node) => {
    //     for (var e of elements) {
    //         if (e.id === node.id) {
    //             e.position.x = node.position.x;
    //             e.position.y = node.position.y;
    //             break;
    //         }
    //     }
    // }

    const disableBodyScroll = () => {
        setLayout({...layout, overflowY: 'hidden'});
    }

    const enableBodyScroll = () => {
        setLayout({...layout, overflowY: 'overlay'});
    }

    return (
        <div style={{positon: "relative"}}>
            <div style={layout}>
                <Grid columns={2} divided>
                    <Grid.Column width="12">
                        <ReactFlowProvider>
                            <div onMouseEnter={disableBodyScroll} onMouseLeave={enableBodyScroll}>
                                <ReactFlow
                                    elements={elements}
                                    style={{width: '100%', height: '95vh'}}
                                    onLoad={onInstanceLoad}
                                    nodeTypes={nodeTypes}
                                    nodesConnectable={false}
                                    onElementClick={onElementClick}
                                    minZoom={0.38}
                                    nodesDraggable={false}
                                    onNodeMouseEnter={onNodeMouseEnter}
                                    onNodeMouseLeave={onNodeMouseLeave}
                                    selectNodesOnDrag={false}
                                    // onNodeDragStop={onNodeDragStop}
                                    elementsSelectable={false}
                                >
                                    <div style={{position: "absolute", zIndex: "10", bottom: "20px", left: "20px"}}>
                                        <Checkbox
                                            toggle
                                            checked={!hideMap.current}
                                            label="Show all courses"
                                            onChange={toggleHidden}
                                        />
                                    </div>
                                    <div style={{position: "absolute", zIndex: "10", top: "30px", right: "30px"}}>
                                        <DropdownSearch toggleExclusion={toggleExclusion} hideMap={hideMap.current} toggleHidden={toggleHidden} searchNodeOptions={searchNodeOptions} searchElements={elements}/>
                                    </div>
                                </ReactFlow>
                            </div>
                            <Container style={{marginBottom: "50px"}}>
                                <Segment raised>
                                    <Header as="h5">Couldn't find a course up there? Add it here:</Header>
                                    <Dropdown
                                        selection
                                        multiple
                                        search
                                        fluid
                                        options={searchAdditionalOptions}
                                        onChange={(e, data) => setAdditionalCourses(data.value)}
                                        placeholder=" courses"
                                    />
                                </Segment>
                            </Container>
                        </ReactFlowProvider>
                    </Grid.Column>
                    <Grid.Column width="4">
                        <Sidebar specialisations={specialisations} selectedNodes={selectedNodes}/>
                    </Grid.Column>
                </Grid>
                {hoverDisplay}
                {/* <button onClick={positionHelper(elements)}>GENERATE POSITION</button> */}
                <div id="DegreePlanner">
                    <DegreePlanner
                        key={Object.keys(selectedNodes).concat(additionalCourses).join("")}
                        program={program}
                        specialisations={specialisations}
                        selectedCourses={Object.keys(selectedNodes).concat(additionalCourses)}
                        coursesJSON={updatedCoursesJSON}
                    />
                </div>
            </div>
        </div>
    );
};

export default ComputerScienceCOMPA1FINSA2;