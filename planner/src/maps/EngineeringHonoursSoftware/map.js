import React, {useState} from 'react';
import ReactFlow from 'react-flow';

const eng_data = require("../../webscraper/engineering_degrees.json");

var initElements = [];

// Temporary generator for positioning
