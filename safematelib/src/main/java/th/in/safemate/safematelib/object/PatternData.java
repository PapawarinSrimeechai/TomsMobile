package th.in.safemate.safematelib.object;

import java.util.ArrayList;
import java.util.Collections;

/**
 * Created by thuny on 02/09/2016.
 */
public class PatternData {
    private int event_id;
    private int id;
    private String data;
    private ArrayList<Float> pattern = new ArrayList<Float>();


    public PatternData(int event_id, int id, String data) {
        this.event_id = event_id;
        this.id = id;
        this.data = data;
        decodeArray(data);
    }

    public PatternData(int event_id, int id, ArrayList<Float> data) {
        this.event_id = event_id;
        this.id = id;
        this.pattern = data;
        encodeArray(data);
    }

    private void decodeArray(String data) {

        data = data.replace("{", "");
        data = data.replace("}", "");
        data = data.replace("[", "");
        data = data.replace("]", "");
        String[] d = data.split(",");


        for (int i = 0; i < d.length; i++) {
            pattern.add(Float.parseFloat(d[i]));
        }


    }

    private void encodeArray(ArrayList<Float> data) {

        String result = "[";

        for (int i = 0; i < data.size(); i++) {
            result += data.get(i);

            if ((i + 1) < data.size()) {
                result += ", ";
            }
        }

        result += "]";
        this.data = result;

    }

    public int getEvent() {
        return this.event_id;
    }

    public int getId() {
        return this.id;
    }

    public String getRawData() {
        return this.data;
    }

    public ArrayList<Float> getData() {
        return this.pattern;
    }


    public float getMax() {
        Object max = Collections.max(this.pattern);
        double result = ((Double) max);
        return (float) result;

    }

    public float getMin() {
        Object min = Collections.min(this.pattern);
        double result = ((Double) min);
        return (float) result;

    }
}

