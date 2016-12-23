package th.in.safemate.safematelib.object;

/**
 * Created by thuny on 05/09/2016.
 */
public class GPSSensor {
    private String datetime;
    double latitude, longitude, speed;

    public GPSSensor(String datetime, double latitude, double longitude, double speed) {
        this.datetime = datetime;
        this.latitude = latitude;
        this.longitude = longitude;
        this.speed = speed;
    }

    public String getDatetime() {
        return datetime;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public double getSpeed() {
        return speed;
    }
}
