package th.in.safemate.safematelib.Utils;

import java.util.ArrayList;

import th.in.safemate.safematelib.object.AxisData;
import th.in.safemate.safematelib.object.PatternMatchingResult;

/**
 * Created by thuny on 02/09/2016.
 */
public class MinimumData {

    public static PatternMatchingResult minPatternMatchinResult(ArrayList<PatternMatchingResult> list) {
        PatternMatchingResult result = new PatternMatchingResult(-1, 1000);
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).getScore() < result.getScore()) {
                result = new PatternMatchingResult(i, list.get(i).getScore());
            }
        }
        return result;
    }


    public static float minAxisDataResult(ArrayList<AxisData> list) {
        float min = 99;
        for (int i = 0; i < list.size(); i++) {
            float data = list.get(i).getData();
            if (min > data) {
                min = data;
            }
        }
        return min;
    }


}
