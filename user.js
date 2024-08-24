var user = "null";

function loadUser()
{
  const userFileUrl = ("https://travel.eliotindex.org/users/" + user + ".txt"); // provide file location
      fetch(userFileUrl)
          .then(r => r.text())
          .then((text) => {
              const userFile = text.split("\n");
              delete userFile[userFile.length - 1]; // last one is blank

              intoArray(userFile);
          })
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

    getStops(ediFile)
}

function getStops(ediFile)
{
  // list stops on route
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
}

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

  dist = segEndDist - segStartDist;
}

function toRadians(degrees)
{
  return degrees * (Math.PI / 180);
}
