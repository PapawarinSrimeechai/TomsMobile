package th.in.safemate.safematelib.Utils;

import java.util.ArrayList;

import th.in.safemate.safematelib.object.AxisData;

/**
 * Created by thuny on 02/09/2016.
 */
public class MovingAverage {
public MovingAverage()
{}

    public  AxisData process(ArrayList<AxisData> data, int window) {
        if(data.size() >= window) {


            float total = 0;
            for (int i = 0; i < data.size(); i++) {
                total += data.get(i).getData();
            }

            return new AxisData(data.get(data.size() - 1).getTimestamp(), total / data.size());
        }
        else
        {
            return null;
        }
    }

}
