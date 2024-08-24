// global input data
var agency = "Not Available";
var code = "Not Available";
var branch = "Not Available";
var length = "Not Available";
var isSegment = false;
var secondRun = false;

var segLength = 0.00;

const agencies = [];
const fullAgencies = [];
const agencyLines = [];

// cumulative
const cumLats = [];
const cumLons = [];

// create arrays
const stopIds = [];
const stopNames = [];
const stopLats = [];
const stopLons = [];
const stopLines = [];
const stopOrders = [];
const segStrings = []; // combined for segments

var segStartOrder = -1;
var segEndOrder = -1;

function clearAll()
{
    // clear everything
    stopIds.length = 0;
    stopNames.length = 0;
    stopLats.length = 0;
    stopLons.length = 0;
    stopLines.length = 0;
    stopOrders.length = 0;
    segStrings.length = 0;
    cumLats.length = 0;
    cumLons.length = 0;
    segStartOrder = -1;
    segEndOrder = -1;
    isSegment = false;
    secondRun = false;
    segLength = 0.00;
    segIndex = 0.00;

    document.getElementById("route").innerHTML = ("Not Available");
    document.getElementById("agency").innerHTML = ("<b>Agency: </b>Not Available");
    document.getElementById("code").innerHTML = ("<b>Code: </b>Not Available");
    document.getElementById("branch").innerHTML = ("<b>Branch: </b>Not Available");
    document.getElementById("length").innerHTML = ("<b>Length: </b>Not Available");
    document.getElementById("index").innerHTML = ("<b>EDI: </b>Not Available");
    document.getElementById("segstart").innerHTML = ("");
    document.getElementById("segend").innerHTML = ("");
    document.getElementById("startDrop2").innerHTML = ("");
    document.getElementById("endDrop2").innerHTML = ("");
    document.getElementById("stops").innerHTML = ("");
}

function getAgencies()
{
    const agencyFileUrl = ("https://dev.eliotindex.org/agencies.txt"); // provide file location
    fetch(agencyFileUrl)
        .then(r => r.text())
        .then((text) => {
            const agencyFile = text.split("\n");
            agencyFile.pop();

            for (let i = 0; i < agencyFile.length; i++)
            {
                var data = agencyFile[i];
                agencies.push(data.substring(0, data.indexOf(";")));
                data = data.substr(data.indexOf(";") + 1);
                fullAgencies.push(data);
                agencyLines.push(fullAgencies[i] + " (" + agencies[i] + ")");
                document.getElementById("agencyDrop").innerHTML += ("<option value=" + agencies[i] + ">" + agencyLines[i] + "</option>");
            }
        })
}

function getOption()
{
    selectedAgency = document.querySelector('#agencyDrop');
    agency = selectedAgency.value;

    for (let i = 0; i < agencies.length; i++)
    {
        if (agencies[i] == agency)
        {
            document.getElementById("agency").innerHTML = ("<b>Agency: </b>" + fullAgencies[i] + " (" + agencies[i] + ")");
        }
    }

    document.getElementById("routeDrop").innerHTML = ("<option value=none>Select a route</option>");

    const routeFileUrl = ("https://dev.eliotindex.org/edis/" + agency + ".txt"); // provide file location
    fetch(routeFileUrl)
        .then(r => r.text())
        .then((text) => {
            const routeFile = text.split("\n");
            routeFile.pop();

            // create arrays
            const lineCodes = [];
            const lineLengths = [];
            const lineEdis = [];
            const lineNames = [];
            const lineBranches = [];
            const fullLineOption = [];

            for (let i = 0; i < routeFile.length; i++)
            {
                var data = routeFile[i];
                lineCodes.push(data.substring(0, data.indexOf(";")));
                data = data.substr(data.indexOf(";") + 1);
                lineLengths.push(data.substring(0, data.indexOf(";")));
                data = data.substr(data.indexOf(";") + 1);
                lineEdis.push(data.substring(0, data.indexOf(";")));
                data = data.substr(data.indexOf(";") + 1);
                lineNames.push(data.substring(0, data.indexOf(";")));
                data = data.substr(data.indexOf(";") + 1);
                lineBranches.push(data);
                fullLineOption.push(lineNames[i] + " (" + lineBranches[i] + ") - " + lineCodes[i]);
                document.getElementById("routeDrop").innerHTML += ("<option value=\"" + lineCodes[i] + "\">" + fullLineOption[i] + "</option>");
            }
        })
}

function findSegment()
{
    isSegment = true;
    document.getElementById("length").innerHTML = ("<b>Length: </b>");
    document.getElementById("segstart").innerHTML = ("<b>Segment Start:</b>");
    document.getElementById("segend").innerHTML = ("<b>Segment End:</b>");
    document.getElementById("startDrop2").innerHTML = ("Segment Start: <select id=startDrop><option value=none>Select a stop</option></select>");
    document.getElementById("endDrop2").innerHTML = ("Segment End: <select id=endDrop><option value=none>Select a stop</option></select> <button onclick=setEnd()>Enter</button>");
    findIndex();
}

function findIndex()
{
    // clear arrays
    stopIds.length = 0;
    stopNames.length = 0;
    stopLats.length = 0;
    stopLons.length = 0;
    stopLines.length = 0;
    stopOrders.length = 0;
    segStrings.length = 0;
    cumLats.length = 0;
    cumLons.length = 0;

    selectedRoute = document.querySelector('#routeDrop');
    code = selectedRoute.value;

    document.getElementById("agency").innerHTML = ("<b>Agency: </b>" + agency);
    document.getElementById("code").innerHTML = ("<b>Code: </b>" + code);

    // gets full agency name
    const agencyFileUrl = ("https://dev.eliotindex.org/agencies.txt"); // provide file location
    fetch(agencyFileUrl)
        .then(r => r.text())
        .then((text) => {
            const agencyFile = text.split("\n");
            agencyFile.pop();

            const agencies = [];
            const fullAgencies = [];

            for (let i = 0; i < agencyFile.length; i++)
            {
                var data = agencyFile[i];
                agencies.push(data.substring(0, data.indexOf(";")));
                data = data.substr(data.indexOf(";") + 1);
                fullAgencies.push(data);
            }
            
            for (let i = 0; i < agencies.length; i++)
            {
                if (agencies[i] == agency)
                {
                    document.getElementById("agency").innerHTML = ("<b>Agency: </b>" + fullAgencies[i] + " (" + agencies[i] + ")");
                }
            }
        })

    const ediFileUrl = ("https://dev.eliotindex.org/files/" + agency +  "-edi.txt"); // provide file location
    fetch(ediFileUrl)
        .then(r => r.text())
        .then((text) => {
            const ediFile = text.split("\n");
            delete ediFile[ediFile.length - 1]; // last one is blank

            intoArray(ediFile);
        })
}

function intoArray(ediFile)
{
    ediFile.pop(); // we might have a bug
    for (let i = 0; i < ediFile.length; i++)
    {
        var data = ediFile[i];
        stopIds.push(data.substring(0, data.indexOf(";")));
        data = data.substr(data.indexOf(";") + 1);
        stopNames.push(data.substring(0, data.indexOf(";")));
        data = data.substr(data.indexOf(";") + 1);
        stopLats.push(data.substring(0, data.indexOf(";")));
        data = data.substr(data.indexOf(";") + 1);
        stopLons.push(data.substring(0, data.indexOf(";")));
        data = data.substr(data.indexOf(";") + 1);
        stopLines.push(data.substring(0, data.indexOf(";")));
        data = data.substr(data.indexOf(";") + 1);
        stopOrders.push(data);
    }

    // populate segment lists
    if (!secondRun)
    {
        if (isSegment)
        {
            for (let i = 0; i < ediFile.length; i++)
            {
                if (stopLines[i] == code)
                {
                    segStrings.push(stopOrders[i] + " - " + stopNames[i] + " (" + stopIds[i] + ")");
                    document.getElementById("startDrop").innerHTML += ("<option value=\"" + stopOrders[i] + "\">" + segStrings[segStrings.length - 1] + "</option>");
                    document.getElementById("endDrop").innerHTML += ("<option value=\"" + stopOrders[i] + "\">" + segStrings[segStrings.length - 1] + "</option>");
                }
            }
        }
    }

    getStops(ediFile)
}

function getStops(ediFile)
{
    if (isSegment)
    {
        // convert from list to display
        startSelect = document.querySelector("#startDrop");
        segStartOrder = parseInt(startSelect.value) - 1;
        endSelect = document.querySelector("#endDrop");
        segEndOrder = parseInt(endSelect.value) - 1;
    }

    // list stops on route
    document.getElementById("stops").innerHTML = ("<b>Stop Listing: </b>");
    var cumCount = 1;

    for (let i = 0; i < ediFile.length; i++)
    {
      if (stopLines[i] == code)
      {
        cumLats.push(stopLats[i]);
        cumLons.push(stopLons[i]);
        cumulative(i, cumCount);
        cumCount++;
      }
    }

    startStats();
}

function setEnd()
{
    // convert from list to display
    startSelect = document.querySelector("#startDrop");
    segStartOrder = parseInt(startSelect.value);
    document.getElementById("segstart").innerHTML = ("<b>Segment Start: </b>" + segStrings[segStartOrder - 1]);
    endSelect = document.querySelector("#endDrop");
    segEndOrder = parseInt(endSelect.value);
    document.getElementById("segend").innerHTML = ("<b>Segment End: </b>" + segStrings[segEndOrder - 1]);
    secondRun = true;
    findIndex();
}

// rolling edi port
var segStartDist = 0.00;
var segEndDist = 0.00;

function cumulative(pos, cumCount)
{
    // haversine formula loop
    // spherical trig cause this is the globe
    // cumLats.length will increase by 1 each run
    var dist = 0;
    for (let i = 1; i < cumLats.length; i++)
    {
        var lon1 = toRadians(Math.abs(cumLons[i - 1]));
        var lon2 = toRadians(Math.abs(cumLons[i]));
        var lat1 = toRadians(Math.abs(cumLats[i - 1]));
        var lat2 = toRadians(Math.abs(cumLats[i]));
        var dlon = lon2 - lon1;
        var dlat = lat2 - lat1;
        var a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);      
        var c = 2 * Math.asin(Math.sqrt(a));
        var r = 3963;

        dist += c * r;
    }

    // full line haversine
    var firstLon = toRadians(cumLons[0]);
    var lastLon = toRadians(cumLons[cumLons.length - 1]);
    var firstLat = toRadians(cumLats[0]);
    var lastLat = toRadians(cumLats[cumLats.length - 1]);
    var difflon = 0; // placeholder
    var difflat = 0; // placeholder

    // longitude math
    if (firstLon >= 0 && lastLon >= 0)
    {
        difflon = lastLon - firstLon;
    }
    else if (firstLon <= 0 && lastLon <= 0)
    {
        lastLon = Math.abs(lastLon);
        firstLon = Math.abs(firstLon);
        difflon = lastLon - firstLon;
    }
    else if (firstLon <= 0 && lastLon >= 0)
    {
        difflon = Math.abs(firstLon - lastLon);
    }
    else if (firstLon >= 0 && lastLon <= 0)
    {
        difflon = Math.abs(lastLon - firstLon);
    }

    // latitude math
    if (firstLat >= 0 && lastLat >= 0)
    {
        difflat = lastLat - firstLat;
    }
    else if (firstLat <= 0 && lastLat <= 0)
    {
        lastLat = Math.abs(lastLat);
        firstLat = Math.abs(firstLat);
        difflat = lastLat - firstLat;
    }
    else if (firstLat <= 0 && lastLat >= 0)
    {
        difflat = Math.abs(firstLat - lastLat);
    }
    else if (firstLat >= 0 && lastLat <= 0)
    {
        difflat = Math.abs(lastLat - firstLat);
    }

    var a1 = Math.pow(Math.sin(difflat / 2), 2) + Math.cos(firstLat) * Math.cos(lastLat) * Math.pow(Math.sin(difflon / 2), 2);      
    var c1 = 2 * Math.asin(Math.sqrt(a1));
    var r1 = 3963;
    var lineDist = c1 * r1;

    // calculate the edi
    var edi = dist / lineDist;
    edi = Math.round(edi * 100.0) / 100.0;

    if (edi < 1 || cumCount == 1) // fixes
    {
        edi = 1.0;
    }

    // dist rounded for display
    dist = Math.round(dist * 100.0) / 100.0;

    // display
    if (isSegment)
    {
      if (cumCount == segStartOrder)
      {
        segStartDist = dist;
      }
      if (cumCount == segEndOrder)
      {
        segEndDist = dist;
      }
      if (cumCount >= segStartOrder && cumCount <= segEndOrder)
      {
        document.getElementById("stops").innerHTML += ("<br><span style=\"background-color: #88ff7e\">" + cumCount + " | " + stopNames[pos] + " (" + stopIds[pos] + ") (" + dist + " mi.)</span>");
      }
      else
      {
        document.getElementById("stops").innerHTML += ("<br>" + cumCount + " | " + stopNames[pos] + " (" + stopIds[pos] + ") (" + dist + " mi.)");
      }
      document.getElementById("length").innerHTML = ("<b>Length: </b>" + (segEndDist - segStartDist) + " miles / ");
    }
    else
    {
      document.getElementById("length").innerHTML = ("<b>Length: </b>");
      document.getElementById("stops").innerHTML += ("<br>" + cumCount + " | " + stopNames[pos] + " (" + stopIds[pos] + ") (" + dist + " mi.)");
    }
}

function toRadians(degrees)
{
    return degrees * (Math.PI / 180);
}

function startStats()
{
    const listFileUrl = ("https://dev.eliotindex.org/edis/" + agency +  ".txt"); // provide file location
    fetch(listFileUrl)
        .then(r => r.text())
        .then((text) => {
            const listFile = text.split("\n");
            delete listFile[listFile.length - 1]; // last one is blank

            getStats(listFile);
        })
}

// this is also where data is added to screen
// who even knows at this point???? most normal ben code is just a hackjob repurposed
function getStats(listFile)
{
    // create arrays
    const lineCodes = [];
    const lineLengths = [];
    const lineEdis = [];
    const lineNames = [];
    const lineBranches = [];

    listFile.pop(); // this fixed a bug
    for (let i = 0; i < listFile.length; i++)
    {
        var data = listFile[i];
        lineCodes.push(data.substring(0, data.indexOf(";")));
        data = data.substr(data.indexOf(";") + 1);
        lineLengths.push(data.substring(0, data.indexOf(";")));
        data = data.substr(data.indexOf(";") + 1);
        lineEdis.push(data.substring(0, data.indexOf(";")));
        data = data.substr(data.indexOf(";") + 1);
        lineNames.push(data.substring(0, data.indexOf(";")));
        data = data.substr(data.indexOf(";") + 1);
        lineBranches.push(data);
    }

    // add data to screen
    for (let i = 0; i < lineCodes.length; i++)
    {
        if (lineCodes[i] == code)
        {
            document.getElementById("route").innerHTML = lineNames[i];
            document.getElementById("branch").innerHTML = ("<b>Branch: </b>" + lineBranches[i]);
            document.getElementById("length").innerHTML += (lineLengths[i] + " miles");
        }
    }
}
