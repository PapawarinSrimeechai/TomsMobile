package th.in.safemate.safematelib.Utils;

import java.util.ArrayList;

import th.in.safemate.safematelib.object.AxisData;

/**
 * Created by thuny on 02/09/2016.
 */
public class Means {

    public static float mean(ArrayList<AxisData> data) {
        float total = 0;
        for (int i = 0; i < data.size(); i++) {
            total += data.get(i).getData();
        }

        return total / data.size();
    }

    public static float continuousMean(ArrayList<AxisData> data,  float mean_old, int n_old) {
        float result = 0;
        float lastdata = data.get(data.size() - 1).getData();
        result = ((n_old * mean_old) + lastdata) / (n_old + 1f);
        return result;
    }

}
