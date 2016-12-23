package th.in.safemate.safematelib.Utils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by thuny on 05/09/2016.
 */
public class TravelTime {

    public static int travelTimeSecond(String dtstart, String dtstop) {
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date startDate = null;
        Date stopDate = null;
        try {
            startDate = df.parse(dtstart);
            stopDate = df.parse(dtstop);
            String newDateString = df.format(startDate);
            //System.out.println(newDateString);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        long seconds = (stopDate.getTime() - startDate.getTime()) / 1000;
        return (int) seconds;
    }

    public static int travelTimeSecond(long dtstart, long dtstop) {
        long seconds = (dtstop - dtstart) / 1000;
        return (int) seconds;
    }
}
