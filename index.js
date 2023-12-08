const rotorSampleJsonFilePath = './json/rotor_sample.json';
const statorSampleJsonFilePath = './json/stator_sample.json';

//rotor 데이터 받아오기
//
fetchJsonData(rotorSampleJsonFilePath)
    .then((rotorData) => {
        const rotorVariables = addVariablesToArray(rotorData);
        // displayDataDiv(rotorVariables, 'resultDiv');

        const rotateNum = rotorVariables.numofSlot;
        let degree = 360 / rotateNum;
        const zone = extractZone(rotorData);
        const zoneCategory = extractZoneName(rotorData);

        // for(let i=0 ;i<zoneCategory.length; i++){

        // }
        const zoneDetails = extractZoneDetails(zone.slot, rotorData.points);

        let rotor = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        rotor.setAttribute('id', 'svg_rotor');
        rotor.setAttribute('transform', 'rotate(0)');
        document.getElementById('svg_move').appendChild(rotor);

        zoneDetails.forEach((el) => {
            if (el.type == 'LINE') {
                drawLine(el.lineDetails, 'rotor');
            } else if (el.type == 'ARC') {
                drawArc(el.arcDetails, 'rotor');
            } else if (el.type == 'POLYLINE') {
                drawPolyline(el.polylineDetails, 'rotor');
            }
        });

        rotateDiv(rotateNum, 'rotor', degree);
    })
    .catch((error) => {
        console.log('Error fetching Rotor Sample JSON Data:', error);
    });

//stator 데이터 받아오기
fetchJsonData(statorSampleJsonFilePath)
    .then((statorData) => {
        const statorVariables = addVariablesToArray(statorData);
        // displayDataDiv(statorVariables, 'asdf');

        const rotateNum = statorVariables.numofSlot;
        let degree = 360 / rotateNum;
        const zone = extractZone(statorData);

        const zoneCategory = extractZoneName(statorData);
        const zoneDetails_airGap = extractZoneDetails(zone.airGap, statorData.points);
        const zoneDetails_slot = extractZoneDetails(zone.slot, statorData.points);

        let stator = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        stator.setAttribute('id', 'svg_stator');
        stator.setAttribute('transform', 'rotate(0)');
        document.getElementById('svg_move').appendChild(stator);

        zoneDetails_slot.forEach((el) => {
            if (el.type == 'LINE') {
                drawLine(el.lineDetails, 'stator');
            } else if (el.type == 'ARC') {
                drawArc(el.arcDetails, 'stator');
            } else if (el.type == 'POLYLINE') {
                drawPolyline(el.polylineDetails, 'stator');
            }
        });
        zoneDetails_airGap.forEach((el) => {
            if (el.type == 'LINE') {
                drawLine(el.lineDetails, 'stator');
            } else if (el.type == 'ARC') {
                drawArc(el.arcDetails, 'stator');
            } else if (el.type == 'POLYLINE') {
                drawPolyline(el.polylineDetails, 'stator');
            }
        });

        rotateDiv(rotateNum, 'stator', degree);
    })
    .catch((error) => {
        console.log('Error fetching Stator Sample JSON Data:', error);
    });

//
//
//
//
//
//
//
//
//
//
// fetch로 json 데이터 가져오기
function fetchJsonData(filePath) {
    return fetch(filePath)
        .then((response) => response.json())
        .catch((error) => {
            console.log(`Error fetching JSON from ${filePath}:`, error);
        });
}

//
function addVariablesToArray(data) {
    const variablesArray = Object.entries(data).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});
    return variablesArray;
}

function displayDataDiv(data, divId) {
    const resultDiv = document.getElementById(divId);
    if (resultDiv) {
        resultDiv.innerHTML = JSON.stringify(data, null, 2);
    } else {
        console.log(`Element with id ${divId} not found.`);
    }
}

// function displayObjectValue(object) {
//     const objectValues = Object.values(object);
//     return objectValues;
// }
// function displayObjectKey(object) {
//     const objectKeys = Object.keys(object);
//     return objectKeys;
// }

function extractZone(sampleData) {
    return sampleData.zone;
}

function extractZoneName(sampleData) {
    return Object.keys(sampleData.zone);
}

function extractLineDetail(line, points) {
    const [startPointName, endPointName] = line[0];
    const startPoint = points[startPointName];
    const endPoint = points[endPointName];

    // console.log('type: LINE');
    // console.log('start', 'end');
    // console.log(startPoint);
    // console.log(endPoint);
    return [{ startPointName: startPoint }, { endPointName: endPoint }];
}

function extractArcDetail(arc, points) {
    const { centerPoint, startPoint, endPoint, radius, startAngle, endAngle, isClockWise } = arc[0];
    const centerPointValue = points[centerPoint];
    const startPointValue = points[startPoint];
    const endPointValue = points[endPoint];
    const radiusValue = radius;
    const startAngleValue = startAngle;
    const endAngleValue = endAngle;
    const isClockWiseValue = isClockWise;

    // console.log('type: ARC');
    // console.log('centerpoint', 'startpoint', 'endPoint');
    // console.log(centerPointValue, startPointValue, endPointValue);
    return [centerPointValue, startPointValue, endPointValue, radiusValue, startAngleValue, endAngleValue, isClockWiseValue];
}

function extractPolylineDetail(polyline, points) {
    let arr = [];
    for (let i = 0; i < polyline[0].length; i++) {
        arr.push(points[polyline[0][i]]);
    }

    // console.log('type: POLYLINE');
    // console.log(polyline[0]);
    // console.log(arr);
    return arr;
}

function extractZoneDetails(zone, points) {
    let result = [];

    zone.forEach((entry) => {
        const { type, attri } = entry;

        if (type === 'LINE') {
            const lineDetails = extractLineDetail(attri, points);
            result.push({ type, lineDetails });
        } else if (type === 'ARC') {
            const arcDetails = extractArcDetail(attri, points);
            result.push({ type, arcDetails });
        } else if (type === 'POLYLINE') {
            const polylineDetails = extractPolylineDetail(attri, points);
            result.push({ type, polylineDetails });
        }
    });
    return result;
}

function selectZone(zoneCategory) {
    let array = [];
    zoneCategory.forEach((category) => {
        array.push(Object.entries(category));
    });
    return array;
}

function drawLine([startPoint, endPoint], whatdata) {
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    line.setAttribute('x1', startPoint.startPointName[0]);
    line.setAttribute('y1', -startPoint.startPointName[1]);
    line.setAttribute('x2', endPoint.endPointName[0]);
    line.setAttribute('y2', -endPoint.endPointName[1]);
    line.setAttribute('stroke', 'black');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('stroke-width', '0.5');
    // console.log(
    //     ('x1', startPoint.startPointName[0]),
    //     ('y1', -startPoint.startPointName[1]),
    //     ('x2', endPoint.endPointName[0]),
    //     ('y2', -endPoint.endPointName[1])
    // );
    document.getElementById(`svg_${whatdata}`).appendChild(line);
}

function drawArc([centerPoint, startPoint, endPoint, radius, startAngle, endAngle, isClockWise], whatdata) {
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    let dAttribute = `M ${startPoint[0]} ${-startPoint[1]} A ${radius} ${radius} 0 0 ${isClockWise ? 1 : 0} ${
        endPoint[0]
    } ${-endPoint[1]}`;

    path.setAttribute('d', dAttribute);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'black');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-width', '0.5');

    document.getElementById(`svg_${whatdata}`).appendChild(path);
}

function drawPolyline(arr, whatdata) {
    let polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    let polylinePoints = [];
    arr.forEach((el) => {
        let x = el[0];
        let y = -el[1];

        polylinePoints.push([x, y]);
    });
    // console.log(polylinePoints.join(' '));
    polyline.setAttribute('points', polylinePoints.join(' '));
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', 'black');
    polyline.setAttribute('stroke-linecap', 'round');
    polyline.setAttribute('stroke-width', '0.5');

    document.getElementById(`svg_${whatdata}`).appendChild(polyline);
}

function rotateDiv(rotateNum, whatdata, degree) {
    let idNum = 0;

    for (let i = 0; i < rotateNum; i++) {
        let originalDiv = document.getElementById(`svg_${whatdata}`);
        let copyDiv = originalDiv.cloneNode(true);
        idNum++;
        copyDiv.id = `svg_${whatdata}` + idNum;
        copyDiv.setAttribute('transform', `rotate(${degree * (i + 1)})`);
        originalDiv.after(copyDiv);
    }
}
