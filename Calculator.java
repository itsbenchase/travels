import java.util.Scanner;
import java.util.ArrayList;
import java.io.File;
import java.io.FileWriter;
import java.net.URI;

// the thing that calculates the Eliot Deviation Index
// massively edit to only have segment calculating bit
// don't need a lot of the extra baggage here

public class Calculator
{
  public static double edi(String agency, String route, int start, int end)
  {
    String agencyChoice = agency;
    String lineChoice = route;
    ArrayList<Stop> stops = new ArrayList<Stop>();
    int stopCount = 0;
    Stop [] theLine;
    
    // loads in EDI file with existing routes only
    try
    {
      Scanner s = new Scanner(new URI("https://dev.eliotindex.org/files/" + agencyChoice + "-edi.txt").toURL().openStream());
      while (s.hasNextLine())
      {
        String data = s.nextLine();
        String id = data.substring(0, data.indexOf(";"));
        data = data.substring(data.indexOf(";") + 1);
        String name = data.substring(0, data.indexOf(";"));
        data = data.substring(data.indexOf(";") + 1);
        double lat = Double.parseDouble(data.substring(0, data.indexOf(";")));
        data = data.substring(data.indexOf(";") + 1);
        double lon = Double.parseDouble(data.substring(0, data.indexOf(";")));
        data = data.substring(data.indexOf(";") + 1); // lines
        String line = data.substring(0, data.indexOf(";"));
        data = data.substring(data.indexOf(";") + 1);
        int order = Integer.parseInt(data);

        stops.add(new Stop(id, name, lat, lon, line, order));
      }
    }
    catch (Exception e)
    {
      System.out.println("Error.");
    }

    int startStop = start;
    int endStop = end;

    // check if in part of line desired
    for (int i = 0; i < stops.size(); i++)
    {
      if (stops.get(i).getLineEDI().equalsIgnoreCase(lineChoice) && stops.get(i).getOrder() <= endStop && stops.get(i).getOrder() >= startStop)
      {
        stopCount++;
      }
    }

    theLine = new Stop[stopCount];
    for (int i = 0; i < stops.size(); i++)
    {
      if (stops.get(i).getLineEDI().equalsIgnoreCase(lineChoice) && stops.get(i).getOrder() <= endStop && stops.get(i).getOrder() >= startStop)
      {
        theLine[stops.get(i).getOrder() - startStop] = stops.get(i);
      }
    }

    // haversine formula loop
    // spherical trig cause this is the globe
    double dist = 0;
    for (int i = 1; i < theLine.length; i++)
    {
      double lon1 = Math.toRadians(Math.abs(theLine[i - 1].getLon()));
      double lon2 = Math.toRadians(Math.abs(theLine[i].getLon()));
      double lat1 = Math.toRadians(Math.abs(theLine[i - 1].getLat()));
      double lat2 = Math.toRadians(Math.abs(theLine[i].getLat()));
      double dlon = lon2 - lon1;
      double dlat = lat2 - lat1;
      double a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);      
      double c = 2 * Math.asin(Math.sqrt(a));
      double r = 3963;

      dist += c * r;
    }

    // full line haversine
    double firstLon = Math.toRadians(theLine[0].getLon());
    double lastLon = Math.toRadians(theLine[theLine.length  - 1].getLon()); // 11 is temp
    double firstLat = Math.toRadians(theLine[0].getLat());
    double lastLat = Math.toRadians(theLine[theLine.length - 1].getLat()); // 11 is temp
    double difflon = 0; // placeholder
    double difflat = 0; // placeholder

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

    double a1 = Math.pow(Math.sin(difflat / 2), 2) + Math.cos(firstLat) * Math.cos(lastLat) * Math.pow(Math.sin(difflon / 2), 2);      
    double c1 = 2 * Math.asin(Math.sqrt(a1));
    double r1 = 3963;
    double lineDist = c1 * r1;

    // calculate the edi
    double edi = dist / lineDist;
    edi = Math.round(edi * 100.0) / 100.0;
    dist = Math.round(dist * 100.0) / 100.0;

    if (edi < 1) // case for the 0.9x
    {
      edi = 1.0;
    }

    return dist;
  }
}