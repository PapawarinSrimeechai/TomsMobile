package th.in.safemate.safematelib.Utils;

import java.util.ArrayList;

import th.in.safemate.safematelib.object.AxisData;

/**
 * Created by thuny on 02/09/2016.
 */
public class SD {


    public static float sd(ArrayList<AxisData> data, float mean) {
        float result = 0;
        float sum = 0;
        for (int i = 0; i < data.size(); i++) {
            sum += Math.pow((data.get(i).getData() - mean), 2);
        }

        result = (float)Math.sqrt((1.0 / (data.size() - 1)) * sum);
        return result;
    }


    public static float continuousSD(ArrayList<AxisData> data, int n_old, double prev_mean,
                         double prev_sd, double cur_mean) {
        float result = 0;
        float sum = 0;

        result = (float)Math.sqrt(

                (((n_old + 1 - 2) * (Math.pow(prev_sd, 2))) + (n_old + 1 - 1)
                        * (Math.pow((prev_mean - cur_mean), 2)) + (Math.pow(
                        (data.get(data.size() - 1).getData() - cur_mean), 2)))
                        / (n_old + 1 - 1)

        );

        return result;
    }
}
