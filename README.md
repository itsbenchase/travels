# Transit Travels
Welcome to a collaborative website of transit riders tracking exactly how much transit distance they've covered throughout their travels. This website is based off of the [Eliot Deviation Index research project](https://eliotindex.org), and the project remains as the original source of all of the route data on this site.

This site and the route data here remains in constant development as of August 2024. Not every desired route may be included at this stage (to be honest, just contribute to the EDI research project for more routes here).

### Getting Started
To track your own travels, get started today through this GitHub repository. There are two important files for contributors to work with to get their travels logged. There is ``users.txt``, which is just a list of usernames currently taken (``collective`` is a reserved username and cannot be taken).

The bulk of the contribution process is with the indivdual user files, located in the ``users`` directory, where files are formatted as follows (using ``users/ben.txt`` as the example here):

```
ma-mbta,Worcester,1,17
il-metra,UP-N,1,27
il-metra,UP-NW-harvard,1,20
ma-wrta,1,1,29
ma-wrta,3,11,30
ma-wrta,4,10,28
ma-wrta,6,1,22
ma-wrta,7,29,39
```

Each log entry is on a new line, one line per route entry, and should be ordered as agency, route, start stop, end stop - for convenience, the Route Viewer webpage has the start and end stop numbers listed with each route. Please keep routes in the same agency grouped together to avoid any logging issues. Agency and route codes are the same as used with the Eliot Deviation Index.

You can also just contact Ben and they'll set you up as soon as possible.

### To-Dos
Things coming soon:
* Front-end presentation
* UI and seek feedback
* Possible Amtrak support
* Log more transit