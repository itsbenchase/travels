var user = "null";
var userDist = 0.00;

const users = [];
const userAgencies = [];
const userRoutes = [];
const userRouteStart = [];
const userRouteEnd = [];
const userFile = [];

const agencies = [];
const fullAgencies = [];

const ediFile = [];
const stopIds = [];
const stopNames = [];
const stopLats = [];
const stopLons = [];
const stopLines = [];
const stopOrders = [];

// cumulative
const cumLats = [];
const cumLons = [];

function getUsers()
{
  const userListUrl = ("https://travel.eliotindex.org/users.txt"); // provide file location
  fetch(userListUrl)
    .then(r => r.text())
    .then((text) => {
      const userList = text.split("\n");
      //userList.pop();

      for (let i = 0; i < userList.length; i++)
      {
        var data = userList[i];
        users.push(data);
        document.getElementById("userDrop").innerHTML += ("<option value=" + users[i] + ">" + users[i] + "</option>");
      }
    })

    // gets full agency name
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
        }
      })
}

function loadUser()
{
  selectedUser = document.querySelector('#userDrop');
  user = selectedUser.value;
  
  const userFileUrl = ("https://travel.eliotindex.org/users/" + user + ".txt"); // provide file location
    fetch(userFileUrl)
      .then(r => r.text())
      .then((text) => {
        const userFile = text.split("\n");
        //delete userFile[userFile.length - 1]; // last one is blank

        intoAgencies(userFile);
      })
}

function intoAgencies(userFile)
{
  //userFile.pop(); // we might have a bug
  for (let i = 0; i < userFile.length; i++)
  {
    var data = userFile[i];
    userAgencies.push(data.substring(0, data.indexOf(",")));
    data = data.substr(data.indexOf(",") + 1);
    userRoutes.push(data.substring(0, data.indexOf(",")));
    data = data.substr(data.indexOf(",") + 1);
    userRouteStart.push(data.substring(0, data.indexOf(",")));
    data = data.substr(data.indexOf(",") + 1);
    userRouteEnd.push(data);
  }

  var agencyAdded = false;

  for (let i = 0; i < agencies.length; i++)
  {
    for (let j = 0; j < userAgencies.length; j++)
    {
      if (agencies[i] == userAgencies[j])
      {
        if (!agencyAdded)
        {
          document.getElementById("info").innerHTML += ("<h3>" + fullAgencies[i] + " (" + agencies[i] + ")</h3>");
          agencyAdded = true;
        }

        getAgencyFile(userAgencies[j]);
      }
    }
  }
}

function getAgencyFile(agency)
{
  const ediFileUrl = ("https://dev.eliotindex.org/files/" + agency + "-edi.txt"); // provide file location
  fetch(ediFileUrl)
    .then(r => r.text())
    .then((text) => {
      const ediFile = text.split("\n");
      //delete ediFile[ediFile.length - 1]; // last one is blank
      
      for (let k = 0; k < ediFile.length; k++)
      {
        var data = ediFile[k];
        stopIds.push(data.substring(0, data.indexOf(";")));
        data = data.substring(data.indexOf(";") + 1);
        stopNames.push(data.substring(0, data.indexOf(";")));
        data = data.substring(data.indexOf(";") + 1);
        stopLats.push(data.substring(0, data.indexOf(";")));
        data = data.substring(data.indexOf(";") + 1);
        stopLons.push(data.substring(0, data.indexOf(";")));
        data = data.substring(data.indexOf(";") + 1);
        stopLines.push(data.substring(0, data.indexOf(";")));
        data = data.substring(data.indexOf(";") + 1);
        stopOrders.push(data);
      }

      listRoutes();
    })
}

function listRoutes()
{
  for (let j = 0; j < userRoutes.length; j++)
  {
    // list stops on route
    for (let i = 0; i < stopLines.length; i++)
    {
      if (stopLines[i] == userRoutes[j])
      {
        cumLats.push(stopLats[i]);
        cumLons.push(stopLons[i]);
      }
    }
    cumulative(userRoutes[j], userRouteStart[j], userRouteEnd[j]);
  }
}

function cumulative(code, segStartOrder, segEndOrder)
{
  // haversine formula loop
  // spherical trig cause this is the globe
  // cumLats.length will increase by 1 each run

  var dist = 0;
  var cumCount = 1;

  var segStartDist = 0.00;
  var segEndDist = 0.00;

  for (let i = 1; i < cumLats.length; i++)
  {
    // display
    if (cumCount == segStartOrder)
    {
      segStartDist = dist;
    }
    if (cumCount == segEndOrder)
    {
      segEndDist = dist;
    }

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

    cumCount++;
  }

  // dist rounded for display
  dist = segEndDist - segStartDist;
  dist = Math.round(dist * 100.0) / 100.0;

  userDist += dist;

  document.getElementById("info").innerHTML += (code + " - " + dist + " mi.<br>");
  document.getElementById("stats").innerHTML += ("User <b>" + user + "</b> has logged <b>" + userDist + "</b> miles in total.");
}

function toRadians(degrees)
{
  return degrees * (Math.PI / 180);
}