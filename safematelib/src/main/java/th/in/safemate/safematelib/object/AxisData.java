package th.in.safemate.safematelib.object;

/**
 * Created by thuny on 01/09/2016.
 */
public class AxisData {
    private long timestamp;
    private float data;

    public AxisData(long timestamp, float data) {
        this.timestamp = timestamp;
        this.data = data;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public float getData() {
        return data;
    }
}
