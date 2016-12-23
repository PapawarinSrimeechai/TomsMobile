package th.in.safemate.safematelib.object;

/**
 * Created by thuny on 05/09/2016.
 */
public class OverspeedResult {
    private String startDatetime, stopDatetime;
    private double startLatitude, startLongitude, stopLatitude, stopLongitude;


    public OverspeedResult(String startDatetime, String stopDatetime, double startLatitude, double startLongitude, double stopLatitude, double stopLongitude) {
        this.startDatetime = startDatetime;
        this.stopDatetime = stopDatetime;
        this.startLatitude = startLatitude;
        this.startLongitude = startLongitude;
        this.stopLatitude = stopLatitude;
        this.stopLongitude = stopLongitude;
    }

    public String getStartDatetime() {
        return startDatetime;
    }

    public String getStopDatetime() {
        return stopDatetime;
    }

    public double getStartLatitude() {
        return startLatitude;
    }

    public double getStartLongitude() {
        return startLongitude;
    }

    public double getStopLatitude() {
        return stopLatitude;
    }

    public double getStopLongitude() {
        return stopLongitude;
    }
}
