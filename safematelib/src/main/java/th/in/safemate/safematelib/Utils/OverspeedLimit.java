package th.in.safemate.safematelib.Utils;

import java.util.ArrayList;

import th.in.safemate.safematelib.object.GPSSensor;
import th.in.safemate.safematelib.object.OverspeedResult;

/**
 * Created by thuny on 05/09/2016.
 */
public class OverspeedLimit {


    //CONFIG
    private float SPEED_LIMIT = 60;
    private int TIME_LIMIT = 45;

    ArrayList<GPSSensor> list_gps = new ArrayList<GPSSensor>();

    public OverspeedLimit() {
    }


    //when add gps sensor
    public OverspeedResult addData(String datetime, double speed, double latitude, double longitude) {
        return process(datetime, speed, latitude, longitude);
    }

    private OverspeedResult process(String datetime, double speed, double latitude, double longitude) {
        //CHECK CURRENTLY SPEED MORE THAN STANDARD
        if (speed >= SPEED_LIMIT) {
            GPSSensor data = new GPSSensor(datetime, latitude, longitude, speed);
            list_gps.add(data);
        } else {

            if (list_gps.size() > 1) {
                //CHECK OVER SPEED LIMIT
                String startDatetime = list_gps.get(0).getDatetime();
                String stopDatetime = list_gps.get(list_gps.size() - 1).getDatetime();
                //CHECK TIME LIMIT
                if (TravelTime.travelTimeSecond(startDatetime, stopDatetime) >= TIME_LIMIT) {
                    //CHECK AVERAGE SPEED
                    if (getAverageSpeed(list_gps) >= SPEED_LIMIT) {
                        GPSSensor startGPS = list_gps.get(0);
                        GPSSensor stopGPS = list_gps.get(list_gps.size() - 1);
                        return new OverspeedResult(startGPS.getDatetime(), stopGPS.getDatetime(), startGPS.getLatitude(), startGPS.getLongitude(), stopGPS.getLatitude(), stopGPS.getLongitude());
                    }
                }
            }
            list_gps.clear();

        }

        return null;
    }

    private double getAverageSpeed(ArrayList<GPSSensor> list_gps) {
        double total = 0;

        for (int i = 0; i < list_gps.size(); i++) {
            total += list_gps.get(i).getSpeed();
        }
        if (total == 0) {
            return 1;
        }
        return total / list_gps.size();
    }


}
