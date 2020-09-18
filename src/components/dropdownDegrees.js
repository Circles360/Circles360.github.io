import { findAllByDisplayValue } from '@testing-library/react';
import React, { Component } from 'react'
import { Button, Dropdown, Container, Grid, Message} from 'semantic-ui-react'

import programsJSON from "../webscraper/programs.json"
import specialisationsJSON from "../webscraper/specialisations.json"

const MAJORS = 1;
const MINORS = 2;
const HONOURS = 3;

const courseOptions = {}
const programOptions = []

for (const code in programsJSON) {
    if (programsJSON[code].degrees_involved.majors.length === 0 && programsJSON[code].degrees_involved.honours.length === 0) continue;

    // Only these programs are supported
    if (!["3707", "3778"].includes(code)) continue;

    programOptions.push({
        "key": code,
        "value": code,
        "text": code + " - " + programsJSON[code].name
    })

    courseOptions[code] = programsJSON[code].degrees_involved
}

for (const code in courseOptions) {
    for (const type in courseOptions[code]) {
        const replacement = [];
        for (const spec of courseOptions[code][type]) {
            if (!(spec in specialisationsJSON)) continue;

            // Only these majors and minors are supported
            if (!["SENGAH", "COMPA1", "ACCTA2", "FINSA2", "INFSA2", "MARKA2", "PSYCM2"].includes(spec)) continue;
            replacement.push({
                "key": spec,
                "value": spec,
                "text": spec + " - " + specialisationsJSON[spec].name
            })
        }
        courseOptions[code][type] = replacement;
    }
}

// returns MAJORS if Majors but no Minors
// returns MINORS if Majors and Minors exist
// returns HONOURS if Honours exist
const getMajors = (code) => {
    if (!(code in courseOptions)) {
        console.log("code not found in majors", code);
        return [];
    }

    if (courseOptions[code].honours.length) return [HONOURS, courseOptions[code].honours];
    if (courseOptions[code].minors.length) return [MINORS, courseOptions[code].majors];
    return [MAJORS, courseOptions[code].majors];
}

const getMinors = (code) => {
    if (!(code in courseOptions)) {
        console.log("code not found in minors", code);
        return [];
    }

    return courseOptions[code].minors;
}

class DropdownDegrees extends Component {
    state = {
        programOptions: programOptions,
        majorOptions: [],
        minorOptions: [],

        disabledPrimary: true,
        disabledSecondary: true,
        hiddenPrimary: 'hidden',
        hiddenSecondary: 'hidden',

        valProgram: null,
        valPrimary: null,
        valSecondary: null,

        phPrimary: "Select",
        phSecondary: "N/A",
    }

    chooseProgram = (e, program) => {
        const [type, majors] = getMajors(program.value)
        console.log(program.value)
        this.setState({
            valProgram: program.value,

            valPrimary: null,
            disabledPrimary: false,
            hiddenPrimary: 'visible',
            majorOptions: majors,
            phPrimary: "Select Major",

            valSecondary: null,
            disabledSecondary: true,
            hiddenSecondary: 'hidden',
            minorOptions: [],
            phSecondary: "N/A"
        })

        if (type === HONOURS) this.setState({phPrimary: "Select Honour"})
        else if (type === MAJORS) this.setState({phPrimary: "Select Major"})
        else {
            this.setState({
                phPrimary: "Select Major",
                phSecondary: "Select Minor (optional)",
                minorOptions: getMinors(program.value),
                disabledSecondary: false,
                hiddenSecondary: 'visible',
            });
        }
    }

    choosePrimary = (e, spec) => {
        this.setState({
            valPrimary: spec.value
        })
    }

    chooseSecondary = (e, minor) => {
        this.setState({
            valSecondary: minor.value
        })
    }

    getLink = () => {
        console.log(window.location.href.split("/")[1]);
        const link = `#/${this.state.valProgram}/${this.state.valPrimary}` + (this.state.valSecondary ? `/${this.state.valSecondary}` : "");
        return link;
    }

    supported = {
        "3707": ["SENGAH"],
        "3778": ["COMPA1"]
    };

    isDisabled = () => {
        this.state.messageVisible = "hidden"

        if (!!this.state.valSecondary) return true;
        if (!(this.state.valProgram in this.supported)) return true;
        if (!this.supported[this.state.valProgram].includes(this.state.valPrimary)) return true;

        const link = `/${this.state.valProgram}/${this.state.valPrimary}` + (this.state.valSecondary ? `/${this.state.valSecondary}` : "");
        const currentURL = window.location.href;
        // console.log(currentURL.slice(currentURL.indexOf("#") + 1))
        if (currentURL.slice(currentURL.indexOf("#") + 1) === link) return true;

        const isSupported = this.state.valProgram === null || this.state.valPrimary === null;
        return isSupported;
    }

    getMessage = () => {
        if (!(this.state.valProgram in this.supported)) {
            return (
                <Message info>
                    {`Only ${Object.keys(this.supported).join(", ")} is supported`}
                </Message>
            )
        }


        if (!this.supported[this.state.valProgram].includes(this.state.valPrimary)) {
            return (
                <Message info>
                    {`Only ${this.supported[this.state.valProgram].join(", ")} is supported`}
                </Message>
            )
        }

        const link = `/${this.state.valProgram}/${this.state.valPrimary}` + (this.state.valSecondary ? `/${this.state.valSecondary}` : "");
        const currentURL = window.location.href;
        // console.log(currentURL.slice(currentURL.indexOf("#") + 1))
        if (currentURL.slice(currentURL.indexOf("#") + 1) === link) {
            return (
                <Message info>
                    {`You're already looking at this degree`}
                </Message>
            )
        }

        return;
    }

    render() {
        return <>
            <Grid centered style={{marginTop: "20px", marginBottom: "20px"}}>
                <Grid.Row>
                    <Dropdown
                        selection
                        search
                        onChange={this.chooseProgram}
                        options= {this.state.programOptions}
                        enabled
                        placeholder= 'Select Program'
                    />
                </Grid.Row>
                <Grid.Row>
                    <Dropdown
                        selection
                        search
                        onChange={this.choosePrimary}
                        options= {this.state.majorOptions}
                        disabled= {this.state.disabledPrimary}
                        value= {this.state.valPrimary}
                        placeholder= {this.state.phPrimary}
                        style={{visibility: this.state.hiddenPrimary}}
                    />
                </Grid.Row>
                <Grid.Row>
                    <Dropdown
                        selection
                        search
                        clearable
                        onChange={this.chooseSecondary}
                        options= {this.state.minorOptions}
                        disabled= {this.state.disabledSecondary}
                        value= {this.state.valSecondary}
                        placeholder= {this.state.phSecondary}
                        style={{visibility: this.state.hiddenSecondary}}
                    />
                </Grid.Row>
                {this.getMessage()}
                <Grid.Row>
                    <Button
                        onClick={() => {window.location.href=this.getLink()}}
                        color="red"
                    >
                        Load flowchart
                    </Button>
                </Grid.Row>
            </Grid>
        </>;
    }
}

export default DropdownDegrees