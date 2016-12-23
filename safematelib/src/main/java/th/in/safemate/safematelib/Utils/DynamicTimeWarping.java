package th.in.safemate.safematelib.Utils;

import java.util.ArrayList;

import th.in.safemate.safematelib.object.AxisData;

/**
 * Created by thuny on 02/09/2016.
 */
public class DynamicTimeWarping {


    public static float run(ArrayList<AxisData> data, ArrayList<Float> pattern) {
        float weight = 1000;
        float totalWeight = 0;
        int totalPath = 0;
        int indexData = 0;
        int indexPattern = 0;
        if (data.size() > 0 && pattern.size() > 0) {
            totalWeight += Math.pow(data.get(0).getData() - pattern.get(0), 2);
            totalPath++;
            indexData = 0;
            indexPattern = 0;
            //LOOP START 0,0 to (size-1), (size-1) :: LEFT BOTTOM to TOP RIGHT
            for (; indexData < data.size() && indexPattern < pattern.size(); ) {

                float topValue = 1000;
                float topRightValue = 1000;
                float rightValue = 1000;
                //CHECK MOVE TOP
                if (indexPattern + 1 < pattern.size()) {
                    topValue = (float) Math.pow(data.get(indexData).getData() - pattern.get(indexPattern + 1), 2);
                }
                //CHECK MOVE TOP RIGHT
                if ((indexPattern + 1) < pattern.size() && (indexData + 1) < data.size()) {
                    topRightValue = (float) Math.pow(data.get(indexData + 1).getData() - pattern.get(indexPattern + 1), 2);
                }
                //CHECK MOVE TOP RIGHT
                if ((indexData + 1) < data.size()) {
                    rightValue = (float) Math.pow(data.get(indexData + 1).getData() - pattern.get(indexPattern), 2);
                }


                //CHECK MIN PATH
                if (topValue != 1000 && topRightValue != 1000 && rightValue != 1000) {
                    if (topValue < topRightValue) {
                        if (topValue < rightValue) {
                            //MOVE TO TOP
                            totalWeight += topValue;
                            indexPattern++;
                        } else {
                            //MOVE TO RIGHT
                            totalWeight += rightValue;
                            indexData++;
                        }
                    } else {
                        if (topRightValue < rightValue) {
                            //MOVE TO TOP RIGHT
                            totalWeight += topRightValue;
                            indexPattern++;
                            indexData++;
                        } else {
                            //MOVE TO RIGHT
                            totalWeight += rightValue;
                            indexData++;
                        }
                    }
                    totalPath++;
                } else {
                    break;
                }


            }
        }
        return (totalPath > 0) ? totalWeight / totalPath : 1000f;

    }


}
