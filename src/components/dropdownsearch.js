import React, { useState } from 'react'
import { Button, Dropdown, Grid } from 'semantic-ui-react'
import { useStoreActions } from 'react-flow-renderer';
import dataJSON from '../maps/EngineeringHonoursSoftware/data.json'
import getElement from './getelement.js'

const nodeOptions = [];
const elementsList= [];

for (const code in dataJSON) {
    const id = dataJSON[code].id;
    //console.log("Printing id", id);
    if (id.includes('-')) continue;

    elementsList.push(
        dataJSON[code]
    )
    nodeOptions.push({
        key: id,
        value: id,
        text: id
    })
}

console.log("Printing NodeOptions", nodeOptions);

export default function DropdownSearch() { 
    const [search, setSearch] = useState(null);
    
    /*state = {
        search: null,
        getOptions: nodeOptions
    }*/

    const handleChange = (e, prop) => {
        setSearch(prop.value);
    }

    const { updateTransform }  = useStoreActions((actions) => actions);
    const transformUpdater = (x, y, zoom) => {
        updateTransform({x, y, k: zoom});
    };


    const clickDone = () => {
        console.log("CLICKED DONE FOR DDS");
        const element = getElement(search, elementsList);
        transformUpdater(-element.position.x + 600, -element.position.y + 350, 1);
    }

        return <>
            <Grid centered style={{marginBottom: "20px"}}>
                <Grid.Row>
                    <Dropdown
                        selection
                        search
                        options={nodeOptions}
                        placeholder='Search Course Node'
                        onChange={handleChange}
                        value={search}
                    />
                </Grid.Row>
                <Grid.Row>
                    <Button
                    onClick={clickDone}
                    color="red"
                    >Find!</Button>
                </Grid.Row>
            </Grid>
        </>;


}
