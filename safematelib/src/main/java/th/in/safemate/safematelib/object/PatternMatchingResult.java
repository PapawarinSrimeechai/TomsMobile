package th.in.safemate.safematelib.object;

/**
 * Created by thuny on 02/09/2016.
 */
public class PatternMatchingResult {
    private int eventID;
    private float score;

    public PatternMatchingResult(int eventID, float score) {
        this.eventID = eventID;
        this.score = score;
    }

    public int getEventID() {
        return eventID;
    }

    public float getScore() {
        return score;
    }
}
