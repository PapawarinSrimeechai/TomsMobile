package th.in.safemate.safematelib.object;

/**
 * Created by thuny on 02/09/2016.
 */
public class SafeMateResult {
    private long timestamp;
    private int eventID;
    private float score;
    private double latitude;
    private double longitude;
    private float minValue;
    private float maxValue;
    public SafeMateResult(long timestamp, int eventID, float score, double latitude, double longitude, float minValue, float maxValue) {
        this.timestamp = timestamp;
        this.eventID = eventID;
        this.score = score;
        this.latitude = latitude;
        this.longitude = longitude;

        this.minValue = minValue;
        this.maxValue = maxValue;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public int getEventID() {
        return eventID;
    }

    public float getScore() {
        return score;
    }

    public double getLongitude() {
        return longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public float getMinValue() {
        return minValue;
    }

    public float getMaxValue() {
        return maxValue;
    }
}


