// update file for travel logs

import java.util.Scanner;
import java.util.ArrayList;
import java.io.File;
import java.io.FileWriter;

public class Update
{
  public static void main(String [] args)
  {
    // segment list files in users folder
    // agency,route,start,end

    ArrayList<String> agency = new ArrayList<String>();
    ArrayList<String> line = new ArrayList<String>();
    ArrayList<Integer> start = new ArrayList<Integer>();
    ArrayList<Integer> end = new ArrayList<Integer>();

    try
    {
      Scanner s = new Scanner(new File("users/ben.txt"));
      while (s.hasNextLine())
      {
        String data = s.nextLine();
        agency.add(data.substring(0, data.indexOf(",")));
        data = data.substring(data.indexOf(",") + 1);
        line.add(data.substring(0, data.indexOf(",")));
        data = data.substring(data.indexOf(",") + 1);
        start.add(Integer.parseInt(data.substring(0, data.indexOf(","))));
        data = data.substring(data.indexOf(",") + 1);
        end.add(Integer.parseInt(data));
      }
    }
    catch (Exception e)
    {
      System.out.println("Error.");
    }

    Calculator segment = new Calculator();
    for (int i = 0; i < agency.size(); i++)
    {
      System.out.println(segment.edi(agency.get(i), line.get(i), start.get(i), end.get(i)));
    }
  }
}