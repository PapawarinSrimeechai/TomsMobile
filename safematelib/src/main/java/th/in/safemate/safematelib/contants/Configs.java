package th.in.safemate.safematelib.contants;

/**
 * Created by thuny on 01/09/2016.
 */
public class Configs {
    //LATERAL A,B
    //LONGITUDINAL L R


    //ORIENTATION
    public static final int  DEVICEC_HORIZONTAL_FORWARD = 1;
    public static final int  DEVICEC_VERTICAL_ROOF  = 2;

    //start algorithm
    public static final int  NUMBER_START_ALGORITHM = 300;
    public static final int  NUMBER_BUFFER_ALGORITHM = 300;
    public static final int  TIMERANGE_ALGORITHM = 200; //ms


    //WINDOW
    public static final int  WINDOW_LATERAL = 30;
    public static final int  WINDOW_LONGITUDINAL = 50;
    public static final int  WINDOW_STANDARD = 30;

    //MOVING AVERAGE :: < WINDOW
    public static final int  WINDOW_MOVING_LATERAL = 10;
    public static final int  WINDOW_MOVING_LONGITUDINAL = 10;
    public static final int  WINDOW_MOVING_STANDARD = 10;


    //STANDARD PREDICT EVENT
    public static final float  SD_EXTRA_LATERAL = 1;
    public static final float  SD_EXTRA_LONGITUDINAL = 1;
    public static final float  SD_DEFAULT_LATERAL = 0.5f;
    public static final float  SD_DEFAULT_LONGITUDINAL = 0.5f;


    //CONTINUOUS POINT
    public static final int  CONT_SKIP_DRIVING_EVENT_LATERAL = 10;
    public static final int  CONT_SKIP_DRIVING_EVENT_LONGITUDINAL = 10;


}
