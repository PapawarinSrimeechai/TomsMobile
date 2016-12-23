package th.in.safemate.safematelib.object;

/**
 * Created by thuny on 01/09/2016.
 */
public class AccelerometerData {

    private long timestamp;
    private float x, y, z;

    public AccelerometerData(long timestamp, float x, float y, float z) {
        this.timestamp = timestamp;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public float getX() {
        return x;
    }

    public float getY() {
        return y;
    }

    public float getZ() {
        return z;
    }
}
