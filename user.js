var user = "null";
var userDist = 0.00;
var globalDist = 0.00;

const users = [];
const agencies = [];
const fullAgencies = [];
const globalFile = [];
const globalUsers = [];
const globalAgencies = [];
const globalRoutes = [];
const globalDistance = [];

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
   
function loadUserFile()
{
  // reset all values
  globalFile.length = 0;
  globalUsers.length = 0;
  globalAgencies.length = 0;
  globalRoutes.length = 0;
  globalDistance.length = 0;
  userDist = 0.00;

  selectedUser = document.querySelector('#userDrop');
  user = selectedUser.value;

  const globalFileUrl = ("https://travel.eliotindex.org/global.txt"); // provide file location
  fetch(globalFileUrl)
    .then(r => r.text())
    .then((text) => {
      const globalFile = text.split("\n");
      globalFile.pop();

      for (let i = 1; i < globalFile.length; i++)
      {
        var data = globalFile[i];
        globalUsers.push(data.substring(0, data.indexOf(",")));
        data = data.substring(data.indexOf(",") + 1);
        globalAgencies.push(data.substring(0, data.indexOf(",")));
        data = data.substring(data.indexOf(",") + 1);
        globalRoutes.push(data.substring(0, data.indexOf(",")));
        data = data.substring(data.indexOf(",") + 1);
        globalDistance.push(data);
      }

      loadUser();
    })
}

function getGlobalTotal()
{
  const globalFileUrl = ("https://travel.eliotindex.org/global.txt"); // provide file location
  fetch(globalFileUrl)
    .then(r => r.text())
    .then((text) => {
      const globalFile = text.split("\n");
      globalFile.pop();
      
      var data = globalFile[0];
      data = data.substring(data.indexOf(",") + 1);
      data = data.substring(data.indexOf(",") + 1);
      globalDist = data.substring(data.indexOf(",") + 1);

      document.getElementById("allusers").innerHTML = ("Together, we have logged <b>" + globalDist + "</b> miles of transit.");
    })
}

function loadUser()
{
  var addedAgencies = [];
  var userAgencies = [];

  for (let i = 0; i < agencies.length; i++)
  {
    for (let j = 0; j < globalUsers.length; j++)
    {
      if (globalUsers[j] == user)
      {
        if (!userAgencies.includes(globalAgencies[j]))
        {
          userAgencies.push(globalAgencies[j]);
        }
      }
    }
  }

  for (let i = 0; i < agencies.length; i++)
  {
    for (let j = 0; j < globalUsers.length; j++)
    {
      if (globalUsers[j] == user)
      {
        // do the valid agency check
        if (!addedAgencies.includes(agencies[i]) && userAgencies.includes(agencies[i]))
        {
          document.getElementById("info").innerHTML += ("<h3>" + fullAgencies[i] + " (" + agencies[i] + ")</h3>");
          addedAgencies.push(agencies[i]);
        }

        // display route and distance
        if (globalAgencies[j] == agencies[i])
        {
          document.getElementById("info").innerHTML += (globalRoutes[j] + " - " + globalDistance[j] + " mi.<br>");
          userDist += parseFloat(globalDistance[j]);
        }
      }
    }
  }

  userDist = Math.round(userDist * 100) / 100;
  document.getElementById("stats").innerHTML = ("User <b>" + user + "</b> has logged <b>" + userDist + "</b> miles of transit.");
}
