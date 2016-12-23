package th.in.safemate.safematelib.Utils;

import java.util.ArrayList;

import th.in.safemate.safematelib.object.AxisData;
import th.in.safemate.safematelib.object.PatternMatchingResult;

/**
 * Created by thuny on 02/09/2016.
 */
public class MaximumData {




    public static float maxAxisDataResult(ArrayList<AxisData> list) {
        float max = -99;
        for (int i = 0; i < list.size(); i++) {
            float data = list.get(i).getData();
            if (max < data) {
                max = data;
            }
        }
        return max;
    }


}
