// update file for travel logs

import java.util.Scanner;
import java.util.ArrayList;
import java.io.File;
import java.io.FileWriter;

public class Update
{
  public static void main(String [] args)
  {
    ArrayList<String> users = new ArrayList<String>();
    ArrayList<String> wholeLog = new ArrayList<String>();
    double allUserDist = 0.00;

    try
    {
      Scanner s = new Scanner(new File("users.txt"));
      while (s.hasNextLine())
      {
        String data = s.nextLine();
        users.add(data);
      }
    }
    catch (Exception e)
    {
      System.out.println("Error.");
    }

    for (int i = 0; i < users.size(); i++)
    {
      double userDist = 0.00;

      ArrayList<String> agency = new ArrayList<String>();
      ArrayList<String> line = new ArrayList<String>();
      ArrayList<Integer> start = new ArrayList<Integer>();
      ArrayList<Integer> end = new ArrayList<Integer>();

      try
      {
        Scanner s = new Scanner(new File("users/" + users.get(i) + ".txt"));
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
      for (int j = 0; j < agency.size(); j++)
      {
        double currentLineDist = segment.edi(agency.get(j), line.get(j), start.get(j), end.get(j));
        wholeLog.add(users.get(i) + "," + agency.get(j) + "," + line.get(j) + "," + currentLineDist);
        userDist += currentLineDist;
        allUserDist += currentLineDist;
      }
    }

    wholeLog.add(0, "collective,all,all," + allUserDist);

    try
    {
      File newFile = new File("global.txt");
      FileWriter fileWriter = new FileWriter(newFile);

      fileWriter.write(wholeLog.get(0) + "\n");
      for (int i = 1; i < wholeLog.size(); i++)
      {
        fileWriter.append(wholeLog.get(i) + "\n");
      }
      fileWriter.close();
    }
    catch (Exception e)
    {
      System.out.println("whoops error.");
    }
  }
}