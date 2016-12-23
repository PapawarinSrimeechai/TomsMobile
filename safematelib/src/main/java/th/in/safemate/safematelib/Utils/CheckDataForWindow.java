package th.in.safemate.safematelib.Utils;

import java.util.ArrayList;

import th.in.safemate.safematelib.object.AxisData;

/**
 * Created by thuny on 01/09/2016.
 */
public class CheckDataForWindow {
    public CheckDataForWindow() {
    }

    //CHECK DATA SAME LENGTH OF WINDOW
    public ArrayList<AxisData> check(ArrayList<AxisData> data, int window) {
        ArrayList<AxisData> result = new ArrayList<AxisData>();
        if (data.size() > window) {
            for (int i = 1; i < data.size(); i++) {
                result.add(data.get(i));
            }
        } else {
            for (int i = 0; i < data.size(); i++) {
                result.add(data.get(i));
            }
        }
        return result;

    }

}
