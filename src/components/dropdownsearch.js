import React, { useState } from "react";
import { Button, Dropdown } from "semantic-ui-react";
import { useStoreActions } from "react-flow-renderer";
import dataJSON from "../maps/EngineeringHonoursSoftware/data.json";
import getElement from "./getelement.js";

const nodeOptions = [];
const elementsList = [];

for (const code in dataJSON) {
    const id = dataJSON[code].id;
    //console.log("Printing id", id);
    if (id.includes("-")) continue;

    elementsList.push(dataJSON[code]);
    nodeOptions.push({
        key: id,
        value: id,
        text: id,
    });
}

// console.log("Printing NodeOptions", nodeOptions);

export default function DropdownSearch(props) {
    const [search, setSearch] = useState(null);
    console.log(props.canvasSize);

    /*state = {
        search: null,
        getOptions: nodeOptions
    }*/
   // const size1 = props.reactFlowInstance.current.project({x: window.innerWidth * 0.75, y: window.innerHeight});
    //const size2 = props.reactFlowInstance.current.project({x: 0, y: 0});
    //var canvasPixelWidth = (size1.x - size2.x) * 0.38;
    //var canvasPixelHeight = (size1.y - size2.y) * 0.38;
    const handleChange = (e, prop) => {
        setSearch(prop.value);
    };

    const { setInitTransform } = useStoreActions((actions) => actions);
    const transformUpdater = (x, y, zoom) => {
        setInitTransform({ x, y, k: zoom });
    };

    const clickDone = () => {
        if (search === null) return;
        const element = getElement(search, elementsList);
        //const flowCentreWidth = window.getInnerWidth() * 0.75;
        //const flowCentreHeight = window.getInnerHeight();

        transformUpdater(
            -(element.position.x)*2 + props.canvasSize[0]/2 - 64,
            -(element.position.y)*2 + props.canvasSize[1]/2 - 64,
            2
        );
    };

    return (
        <>
            <Dropdown
                selection
                search
                options={nodeOptions}
                placeholder="Looking for a course?"
                onChange={handleChange}
                onKeyPress={event => {
                    if (event.key === 'Enter') {
                      clickDone();
                    }
                  }}
                value={search}
            />
            <Button
                onClick={clickDone}
                icon="search"
                color="red"
                style={{marginLeft: "5px"}}
            >
            </Button>
        </>
    );
}
