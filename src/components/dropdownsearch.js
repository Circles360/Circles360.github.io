import React, { Component } from 'react'
import { Button, Dropdown, Grid } from 'semantic-ui-react'
import { useStoreActions } from 'react-flow-renderer';
import dataJSON from '../maps/EngineeringHonoursSoftware/data.json'
import getElement from './getelement.js'

const nodeOptions = [];
const elementsList= [];

for (const code in dataJSON) {
    const id = dataJSON[code].id;
    //console.log("Printing id", id);
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
    
    state = {
        search: null,
        getOptions: nodeOptions
    }

    handleChange = (e, prop) => {
        this.setState({
            search: prop.value
        })
    }

    updateTransform  = useStoreActions((actions) => actions);
    
    clickDone = () => {
        console.log("Clicked done for dropdownsearch");
        const element = getElement(this.state.search, elementsList)
        this.transformUpdater(-element.position.x + 500, -element.position.y + 500, 1);
    }

    transformUpdater = (x, y, zoom) => {
        updateTransform({x, y, k:zoom});
    }


        return <>
            <Grid centered style={{marginBottom: "20px"}}>
                <Grid.Row>
                    <Dropdown
                        selection
                        search
                        options= {this.state.getOptions}
                        placeholder= 'Search Course Node'
                        onChange={this.handleChange}
                        value= {this.state.search}
                    />
                </Grid.Row>
                <Grid.Row>
                    <Button
                    onClick={this.clickDone}
                    color="red"
                    >Find!</Button>
                </Grid.Row>
            </Grid>
        </>;


}
