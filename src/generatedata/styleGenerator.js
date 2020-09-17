function hexToRgb(hex) {
    hex = hex.substr(1);
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return [r, g, b];
}

function rgbToHex(red, green, blue) {    
    var hex1 = red.toString(16);
    if (hex1.length < 2) {
        hex1 = "0" + hex1;
    }
    var hex2 = Number(green).toString(16);
    if (hex2.length < 2) {
        hex2 = "0" + hex2;
    }
    var hex3 = Number(blue).toString(16);
    if (hex3.length < 2) {
        hex3 = "0" + hex3;
    }
    
    return '#' + hex1 + hex2 + hex3;
}

function lightenHex(hex, factor) {
    var rgb = hexToRgb(hex);
    var red = 255 - (255 - rgb[0]) * (1 - factor);
    var green = 255 - (255 - rgb[1]) * (1 - factor);
    var blue = 255 - (255 - rgb[2]) * (1 - factor);

    return rgbToHex(Math.round(red), Math.round(green), Math.round(blue));
}


exports.hexToRgb = hexToRgb;
exports.rgbToHex = rgbToHex;
exports.lightenHex = lightenHex;
