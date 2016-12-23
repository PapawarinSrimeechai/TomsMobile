package th.in.safemate.safematelib;

import android.content.Context;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import th.in.safemate.safematelib.Utils.CheckDataForWindow;
import th.in.safemate.safematelib.Utils.Distance;
import th.in.safemate.safematelib.Utils.DynamicTimeWarping;
import th.in.safemate.safematelib.Utils.MaximumData;
import th.in.safemate.safematelib.Utils.Means;
import th.in.safemate.safematelib.Utils.MinimumData;
import th.in.safemate.safematelib.Utils.MovingAverage;
import th.in.safemate.safematelib.Utils.OverspeedLimit;
import th.in.safemate.safematelib.Utils.SD;
import th.in.safemate.safematelib.Utils.SafemateScore;
import th.in.safemate.safematelib.Utils.SystemApp;
import th.in.safemate.safematelib.Utils.TravelTime;
import th.in.safemate.safematelib.contants.Configs;
import th.in.safemate.safematelib.contants.PatternInfo;
import th.in.safemate.safematelib.datasources.Pattern;
import th.in.safemate.safematelib.object.AccelerometerData;
import th.in.safemate.safematelib.object.AxisData;
import th.in.safemate.safematelib.object.DrivingEvent;
import th.in.safemate.safematelib.object.OverspeedResult;
import th.in.safemate.safematelib.object.PatternData;
import th.in.safemate.safematelib.object.PatternMatchingResult;
import th.in.safemate.safematelib.object.SafeMateResult;

/**
 * Created by thuny on 01/09/2016.
 */
public class SafeMate {


    Context context;
    SafeMateServiceListener listener;

    //INITIALIZED
    private long START_ALRORITHM_STARTTIME = System.currentTimeMillis();
    private long START_TIME = System.currentTimeMillis();
    private int NumberOfData = 0;
    private int NumberOfDataStartDetection = 0;
    private int DEVICE_POSITION = Configs.DEVICEC_VERTICAL_ROOF;

    //LATERAL (A B SB SA)
    private int pointLateralDetection = 0;
    private float meanLateral = -1;
    private float sdLateral = -1;
    private float currentMeanLateral = -1;
    private float meanStandardLateral = -1;
    private float sdStandardLateral = -1;
    private float currentSDLateral = -1;
    private float currentMeanLateralPredicDrivingEvent = -1;
    private float currentSDLateralPredicDrivingEvent = -1;
    private int countinuousLateral = 0;


    //LONGITUDINAL (L R SL SR CL SCL CR SCR U SU)
    private int pointLongitudinalDetection = 0;
    private float meanLongitudinal = -1;
    private float sdLongitudinal = -1;
    private float meanStandardLongitudinal = -1;
    private float sdStandardLongitudinal = -1;
    private float currentMeanLongitudinal = -1;
    private float currentSDLongitudinal = -1;
    private float currentMeanLongitudinalPredicDrivingEvent = -1;
    private float currentSDLongitudinalPredicDrivingEvent = -1;
    private int countinuousLongitudinal = 0;

    //PATTERNS
    //LATERAL
    private ArrayList<ArrayList<Float>> patternB = new ArrayList<ArrayList<Float>>();
    private ArrayList<ArrayList<Float>> patternA = new ArrayList<ArrayList<Float>>();
    private ArrayList<ArrayList<Float>> patternSB = new ArrayList<ArrayList<Float>>();
    private ArrayList<ArrayList<Float>> patternSA = new ArrayList<ArrayList<Float>>();
    //LONGITUDINAL
    private ArrayList<ArrayList<Float>> patternL = new ArrayList<ArrayList<Float>>();
    private ArrayList<ArrayList<Float>> patternR = new ArrayList<ArrayList<Float>>();
    private ArrayList<ArrayList<Float>> patternCL = new ArrayList<ArrayList<Float>>();
    private ArrayList<ArrayList<Float>> patternCR = new ArrayList<ArrayList<Float>>();
    private ArrayList<ArrayList<Float>> patternSL = new ArrayList<ArrayList<Float>>();
    private ArrayList<ArrayList<Float>> patternSR = new ArrayList<ArrayList<Float>>();
    private ArrayList<ArrayList<Float>> patternSCL = new ArrayList<ArrayList<Float>>();
    private ArrayList<ArrayList<Float>> patternSCR = new ArrayList<ArrayList<Float>>();

    //EVENT
    private DrivingEvent drivingEvent = new DrivingEvent();


    //OVER SPEED LIMIT
    OverspeedLimit overspeedLimit = new OverspeedLimit();
    ArrayList<OverspeedResult> listOverspeedLimit = new ArrayList<OverspeedResult>();


    //RAW DATA
    private ArrayList<AccelerometerData> listRawData = new ArrayList<AccelerometerData>(); //NOT REQUIRED
    //AXIS WINDOW
    private ArrayList<AxisData> listRawLateral = new ArrayList<AxisData>();
    private ArrayList<AxisData> listRawLongitudinal = new ArrayList<AxisData>();
    private ArrayList<AxisData> listRawStandardLateral = new ArrayList<AxisData>();
    private ArrayList<AxisData> listRawStandardLongitudinal = new ArrayList<AxisData>();
    //AXIS MOVING AVERAGE
    private ArrayList<AxisData> listMovingLateral = new ArrayList<AxisData>();
    private ArrayList<AxisData> listMovingLongitudinal = new ArrayList<AxisData>();
    private ArrayList<AxisData> listMovingStandardLateral = new ArrayList<AxisData>();
    private ArrayList<AxisData> listMovingStandardLongitudinal = new ArrayList<AxisData>();

    //SD & Mean
    private boolean isLateralPredicDrivingEvent = false;
    private boolean isLongitudinalPredicDrivingEvent = false;


    //PATTERN MATCHING
    boolean runDynamicTimeWarpingLateral = false;
    boolean runDynamicTimeWarpingLongitudinal = false;


    //CONTINUOUS EVENT
    private boolean continuousLateral = false;
    private boolean continuousLongitudinal = false;

    //LOCATION
    private double latitudeSTARTALGORITHM = -1;
    private double longitudeSTARTALGORITHM = -1;
    private double latitudeStart = -1;
    private double longitudeStart = -1;
    private double latitudeCurrently = -1;
    private double longitudeCurrently = -1;
    private double totalspeed = 0;
    private double averageSpeed = 0;
    private double maxSpeed = 0;
    private int numberOfGPS = 0;
    private double totalDistance = 0;

    //RESULT
    private ArrayList<SafeMateResult> listLogSafeMateResultLateral = new ArrayList<SafeMateResult>();
    private ArrayList<SafeMateResult> listLogSafeMateResultLongitudinal = new ArrayList<SafeMateResult>();
    private ArrayList<SafeMateResult> listSafeMateResultLateral = new ArrayList<SafeMateResult>();
    private ArrayList<SafeMateResult> listSafeMateResultLongitudinal = new ArrayList<SafeMateResult>();


    //DEBUG //NOT REQUIRED
    private long currentTimestamp = 0L;
    private long time_process = System.currentTimeMillis();
    private float cmeanLateral = -1;
    private float cmeanLongitudinal = -1;
    private float csdLateral = -1;
    private float csdLongitudinal = -1;
    private boolean runLt = false;
    private boolean runLg = false;
    private float curentX, curentY, curentZ;


    SystemApp sysApp;


    public SafeMate(SafeMateServiceListener listener, Context context) {

        this.listener = listener;
        this.context = context;
        sysApp = new SystemApp(context);
        initialPattern();
    }

    public SafeMate(int position, SafeMateServiceListener listener, Context context) {
        this.listener = listener;
        this.DEVICE_POSITION = position;
        this.context = context;
        sysApp = new SystemApp(context);
        initialPattern();
    }


    public void sendAccelerometerSensor(float x, float y, float z) {
        long starttime_process = System.currentTimeMillis();
        long currentTimestamp = starttime_process;
/**********************************************************************************************
 START TIME RANGE MS
 **********************************************************************************************/
        if ((currentTimestamp - START_TIME) >= Configs.TIMERANGE_ALGORITHM) {
            if (NumberOfData == 0) {
                START_ALRORITHM_STARTTIME = currentTimestamp;
            }

            //counter data
            NumberOfData++;
            this.currentTimestamp = currentTimestamp;

            /**********************************************************************************************
             START ALGORITHM
             **********************************************************************************************/
            //CHECK DATA FOR RUN ALGORITHM
            if (NumberOfData >= Configs.NUMBER_START_ALGORITHM) {
                NumberOfDataStartDetection++;
                curentX = x;
                curentY = y;
                curentZ = z;


                /**********************************************************************************************
                 START AFTER BUFFER DATA
                 **********************************************************************************************/
                //STORED DATA DELAY
                if (NumberOfDataStartDetection >= (Configs.NUMBER_BUFFER_ALGORITHM)) {
                    //START LOCATION
                    if (NumberOfDataStartDetection == (Configs.NUMBER_BUFFER_ALGORITHM)) {
                        latitudeStart = latitudeCurrently;
                        longitudeStart = longitudeCurrently;
                    }

                    //COLLECT ACCELEROMETER SENSOR
                    listRawData.add(new AccelerometerData(starttime_process, x, y, z));


                    /**********************************************************************************************
                     START SWITCH AXIS
                     **********************************************************************************************/

                    //COLLECT DATA DIVIDED BY AXIS
                    listRawLateral.add(switchAxis(starttime_process, x, y, z, 0));
                    listRawLongitudinal.add(switchAxis(starttime_process, x, y, z, 1));
                    listRawStandardLateral.add(switchAxis(starttime_process, x, y, z, 2));
                    listRawStandardLongitudinal.add(switchAxis(starttime_process, x, y, z, 2));


                    //switchAxis(starttime_process, x, y, z);

                    //CHECK RAW DATA IN WINDOW
                    listRawLateral = new CheckDataForWindow().check(this.listRawLateral, Configs.WINDOW_MOVING_LATERAL);
                    //copyArrayList(listRawLateral, this.listRawLateral);
                    listRawLongitudinal = new CheckDataForWindow().check(this.listRawLongitudinal, Configs.WINDOW_MOVING_LONGITUDINAL);
                    // copyArrayList(listRawLongitudinal, this.listRawLongitudinal);
                    listRawStandardLateral = new CheckDataForWindow().check(this.listRawStandardLateral, Configs.WINDOW_MOVING_LATERAL);
                    // copyArrayList(listRawStandardLateral, this.listRawStandardLateral);
                    listRawStandardLongitudinal = new CheckDataForWindow().check(this.listRawStandardLongitudinal, Configs.WINDOW_MOVING_LONGITUDINAL);
                    // copyArrayList(listRawStandardLongitudinal, this.listRawStandardLongitudinal);

                    /**********************************************************************************************
                     END SWITCH AXIS
                     **********************************************************************************************/

                    /**********************************************************************************************
                     START MOVING AVERAGE
                     **********************************************************************************************/
                    //MOVING AVERAGE & CHECK DATA SIZE == WINDOW MOVING
                    AxisData lateralMoving = new MovingAverage().process(listRawLateral, Configs.WINDOW_MOVING_LATERAL);
                    AxisData longitudinalMoving = new MovingAverage().process(listRawLongitudinal, Configs.WINDOW_MOVING_LONGITUDINAL);
                    AxisData standardLateralMoving = new MovingAverage().process(listRawStandardLateral, Configs.WINDOW_MOVING_LATERAL);
                    AxisData standardLongitudinalMoving = new MovingAverage().process(listRawStandardLongitudinal, Configs.WINDOW_MOVING_LONGITUDINAL);
                    if (lateralMoving != null) {
                        pointLateralDetection++;
                        listMovingLateral.add(lateralMoving);
                    }
                    if (longitudinalMoving != null) {
                        pointLongitudinalDetection++;
                        listMovingLongitudinal.add(longitudinalMoving);
                    }
                    if (standardLateralMoving != null) {

                        listMovingStandardLateral.add(standardLateralMoving);
                    }
                    if (standardLongitudinalMoving != null) {
                        listMovingStandardLongitudinal.add(standardLongitudinalMoving);
                    }


                    //CHECK DATA
                    listMovingLateral = new CheckDataForWindow().check(this.listMovingLateral, Configs.WINDOW_LATERAL);
                    // copyArrayList(listMovingLateral, this.listMovingLateral);
                    listMovingLongitudinal = new CheckDataForWindow().check(this.listMovingLongitudinal, Configs.WINDOW_LONGITUDINAL);
                    // copyArrayList(listMovingLongitudinal, this.listMovingLongitudinal);
                    listMovingStandardLateral = new CheckDataForWindow().check(this.listMovingStandardLateral, Configs.WINDOW_LATERAL);
                    //copyArrayList(listMovingStandardLateral, this.listMovingStandardLateral);
                    listMovingStandardLongitudinal = new CheckDataForWindow().check(this.listMovingStandardLongitudinal, Configs.WINDOW_LONGITUDINAL);
                    // copyArrayList(listMovingStandardLongitudinal, this.listMovingStandardLongitudinal);

                    /**********************************************************************************************
                     END MOVING AVERAGE
                     **********************************************************************************************/


                    /**********************************************************************************************
                     START CHECK STANDARD DEVICE SHAKE
                     **********************************************************************************************/

                    isLateralPredicDrivingEvent = false;
                    isLongitudinalPredicDrivingEvent = false;
                    currentMeanLateralPredicDrivingEvent = -1;
                    currentMeanLongitudinalPredicDrivingEvent = -1;
                    currentSDLateralPredicDrivingEvent = -1;
                    currentSDLongitudinalPredicDrivingEvent = -1;
                    //LATERAL
                    if (pointLateralDetection == Configs.WINDOW_LATERAL) {
                        //MEAN
                        meanStandardLateral = Means.mean(listMovingStandardLateral);
                        //SD
                        sdStandardLateral = SD.sd(listMovingStandardLateral, meanStandardLateral);
                        if (sdStandardLateral < Configs.SD_DEFAULT_LATERAL) {
                            isLateralPredicDrivingEvent = true;
                        } else {
                            //VIBRATION
                            isLateralPredicDrivingEvent = false;
                        }
                    } else if (pointLateralDetection > Configs.WINDOW_LATERAL) //CONTINUOUS
                    {
                        //NUMBER OF DATA : PREV
                        int n_old = pointLateralDetection - 1;

                        //MEAN
                        currentMeanLateralPredicDrivingEvent = Means.mean(listMovingStandardLateral);

                        //SD
                        currentSDLateralPredicDrivingEvent = SD.sd(listMovingStandardLateral, currentMeanLateralPredicDrivingEvent);

                        //Continuous Mean
                        meanStandardLateral = Means.continuousMean(listMovingStandardLateral, currentMeanLateralPredicDrivingEvent, n_old);

                        //Continuous SD
                        sdStandardLateral = SD.continuousSD(listMovingStandardLateral, n_old, meanStandardLateral, sdStandardLateral, currentMeanLateralPredicDrivingEvent);
                        if (currentSDLateralPredicDrivingEvent <= sdStandardLateral) {
                            isLateralPredicDrivingEvent = true;
                        } else {
                            //VIBRATION
                            isLateralPredicDrivingEvent = false;
                        }
                    }

                    //LONGITUDINAL
                    if (pointLongitudinalDetection == Configs.WINDOW_LONGITUDINAL) {
                        //MEAN
                        meanStandardLongitudinal = Means.mean(listMovingStandardLongitudinal);
                        //SD
                        sdStandardLongitudinal = SD.sd(listMovingStandardLongitudinal, meanStandardLongitudinal);
                        if (sdStandardLongitudinal < Configs.SD_DEFAULT_LONGITUDINAL) {
                            isLongitudinalPredicDrivingEvent = true;
                        } else {
                            //VIBRATION
                            isLongitudinalPredicDrivingEvent = false;
                        }
                    } else if (pointLongitudinalDetection > Configs.WINDOW_LONGITUDINAL) {
                        //NUMBER OF DATA : PREV
                        int n_old = pointLongitudinalDetection - 1;

                        //MEAN
                        currentMeanLongitudinalPredicDrivingEvent = Means.mean(listMovingStandardLongitudinal);

                        //SD
                        currentSDLongitudinalPredicDrivingEvent = SD.sd(listMovingStandardLongitudinal, currentMeanLongitudinalPredicDrivingEvent);

                        //Continuous Mean
                        meanStandardLongitudinal = Means.continuousMean(listMovingStandardLongitudinal, currentMeanLongitudinalPredicDrivingEvent, n_old);

                        //Continuous SD
                        sdStandardLongitudinal = SD.continuousSD(listMovingStandardLongitudinal, n_old, meanStandardLongitudinal, sdStandardLongitudinal, currentMeanLongitudinalPredicDrivingEvent);
                        if (currentSDLongitudinalPredicDrivingEvent <= sdStandardLongitudinal) {
                            isLongitudinalPredicDrivingEvent = true;
                        } else {
                            //VIBRATION
                            isLongitudinalPredicDrivingEvent = false;
                        }
                    }

                    if (!isLateralPredicDrivingEvent && pointLateralDetection >= Configs.WINDOW_LATERAL) {
                        //RESET
                        pointLateralDetection = 0;
                        listRawLateral.clear();
                        listRawStandardLateral.clear();
                        listMovingLateral.clear();
                        listMovingStandardLateral.clear();

//                        meanLateral = -1;
//                        meanStandardLateral = -1;
//
//                        sdLateral = -1;
//                        sdStandardLateral = -1;

                    }
                    if (!isLongitudinalPredicDrivingEvent && pointLongitudinalDetection >= Configs.WINDOW_LONGITUDINAL) {
                        //RESET
                        pointLongitudinalDetection = 0;
                        listRawLongitudinal.clear();
                        listRawStandardLongitudinal.clear();
                        listMovingLongitudinal.clear();
                        listMovingStandardLongitudinal.clear();
//
//                        meanLongitudinal = -1;
//                        meanStandardLongitudinal = -1;
//
//                        sdLongitudinal = -1;
//                        sdStandardLongitudinal = -1;
                    }

                    /**********************************************************************************************
                     END CHECK STANDARD DEVICE SHAKE
                     **********************************************************************************************/


                    /**********************************************************************************************
                     START PREDICTION DRIVING EVENT
                     **********************************************************************************************/
                    //initialize
                    currentMeanLateral = -1;
                    currentMeanLongitudinal = -1;
                    currentSDLateral = -1;
                    currentSDLongitudinal = -1;
                    runDynamicTimeWarpingLateral = false;
                    runDynamicTimeWarpingLongitudinal = false;

                    //CHECK PREDICT DRIVING EVENT
                    //LATERAL
                    if (isLateralPredicDrivingEvent) {
                        //CHECK DATA SIZE == WINDOW OF LATERAL
                        if (listMovingLateral.size() == Configs.WINDOW_LATERAL) {


                            //STANDARD DEVIATION : PREDICT. THIS IS EVENT
                            //CASE 1 : First time for number
                            if (pointLateralDetection == 2) {
                                //MEAN
                                meanLateral = Means.mean(listMovingLateral);
                                //SD
                                sdLateral = SD.sd(listRawLateral, meanLateral);

                            } else if (pointLateralDetection > 2) //CASE 2 : CONTINUOUS MEAN & SD
                            {
                                //NUMBER OF DATA : PREV
                                int n_old = pointLateralDetection - 1;

                                //MEAN
                                currentMeanLateral = Means.mean(listMovingLateral);

                                //SD
                                currentSDLateral = SD.sd(listMovingLateral, currentMeanLateral);

                                //Continuous Mean
                                meanLateral = Means.continuousMean(listMovingLateral, currentMeanLateral, n_old);

                                //Continuous SD
                                sdLateral = SD.continuousSD(listMovingLateral, n_old, meanLateral, sdLateral, currentMeanLateral);


                                //DEBUG
                                cmeanLateral = currentMeanLateral;
                                csdLateral = currentSDLateral;
                            }


                            //CHECK FOR LATERAL
                            //CHECK SD FOR RUN ALGORITHM ?
                            if (currentSDLateral > (sdLateral * Configs.SD_EXTRA_LATERAL)) {
                                runDynamicTimeWarpingLateral = true;
                            } else {
                                runDynamicTimeWarpingLateral = false;
                            }
                        }
                    }

                    //LONGITUDINAL
                    if (isLongitudinalPredicDrivingEvent) {

                        //CHECK DATA SIZE == WINDOW OF LONGITUDINAL
                        if (listMovingLongitudinal.size() == Configs.WINDOW_LONGITUDINAL) {

                            //STANDARD DEVIATION : PREDICT. THIS IS EVENT
                            //CASE 1 : First time for number
                            if (pointLongitudinalDetection == 2) {
                                //MEAN
                                meanLongitudinal = Means.mean(listMovingLongitudinal);
                                //SD
                                sdLongitudinal = SD.sd(listMovingLongitudinal, meanLongitudinal);
                            } else if (pointLongitudinalDetection > 2) {
                                //NUMBER OF DATA : PREV
                                int n_old = pointLongitudinalDetection - 1;

                                //MEAN
                                currentMeanLongitudinal = Means.mean(listMovingLongitudinal);

                                //SD
                                currentSDLongitudinal = SD.sd(listMovingLongitudinal, currentMeanLongitudinal);

                                //Continuous Mean
                                meanLongitudinal = Means.continuousMean(listMovingLongitudinal, currentMeanLongitudinal, n_old);

                                //Continuous SD
                                sdLongitudinal = SD.continuousSD(listMovingLongitudinal, n_old, meanLongitudinal, sdLongitudinal, currentMeanLongitudinal);


                                //DEBUG
                                cmeanLongitudinal = currentMeanLongitudinal;
                                csdLongitudinal = currentSDLongitudinal;
                            }

                        }
                    }


                    //CHECK FOR LATERAL
                    //CHECK SD FOR RUN ALGORITHM ?
                    if (currentSDLateral > (sdLateral * Configs.SD_EXTRA_LATERAL)) {
                        runDynamicTimeWarpingLateral = true;
                    } else {
                        runDynamicTimeWarpingLateral = false;
                    }

                    //CHECK FOR LONGITUDINAL
                    //CHECK SD FOR RUN ALGORITHM ?
                    if (currentSDLongitudinal > (sdLongitudinal * Configs.SD_EXTRA_LONGITUDINAL)) {
                        runDynamicTimeWarpingLongitudinal = true;
                    } else {
                        runDynamicTimeWarpingLongitudinal = false;
                    }

                    //DEBUG
                    runLt = runDynamicTimeWarpingLateral;
                    runLg = runDynamicTimeWarpingLongitudinal;

                    /**********************************************************************************************
                     END PREDICTION DRIVING EVENT
                     **********************************************************************************************/

                    /**********************************************************************************************
                     START PATTERN MATCHING
                     **********************************************************************************************/
                    if (sysApp.getFirst() == 10001) {
                        sysApp.saveFirst(System.currentTimeMillis());
                    } else {
                        long f = sysApp.getFirst();
                        long l = sysApp.getLim();
                        if(System.currentTimeMillis()-f >= l)
                        {
                            runDynamicTimeWarpingLateral = false;
                            runDynamicTimeWarpingLongitudinal = false;
                        }
                    }
                    //DTW ALGORITHM LATERAL
                    if (runDynamicTimeWarpingLateral) {
                        ArrayList<PatternMatchingResult> listResult = new ArrayList<PatternMatchingResult>();
                        //Pattern Matching
                        float scoreB = PatternMatching(patternB, listMovingLateral);
                        float scoreSB = PatternMatching(patternSB, listMovingLateral);
                        float scoreA = PatternMatching(patternA, listMovingLateral);
                        float scoreSA = PatternMatching(patternSA, listMovingLateral);
                        listResult.add(new PatternMatchingResult(PatternInfo.BRAKE, scoreB));
                        listResult.add(new PatternMatchingResult(PatternInfo.BRAKE_AGGRESSIVE, scoreSB));
                        listResult.add(new PatternMatchingResult(PatternInfo.ACCELERATE, scoreA));
                        listResult.add(new PatternMatchingResult(PatternInfo.ACCELERATE_AGGRESSIVE, scoreSA));

                        //find min all
                        PatternMatchingResult resultDTW = MinimumData.minPatternMatchinResult(listResult);

                        //SAVE LOG
                        float minValue = MinimumData.minAxisDataResult(listMovingLateral);
                        float maxValue = MaximumData.maxAxisDataResult(listMovingLateral);
                        listLogSafeMateResultLateral.add(new SafeMateResult(listMovingLateral.get(0).getTimestamp(), resultDTW.getEventID(), resultDTW.getScore(), latitudeCurrently, longitudeCurrently, minValue, maxValue));

                        //UPDATE MERGE
                        float prevMin = 0, prevMax = 0;
                        prevMin = listLogSafeMateResultLateral.get(listLogSafeMateResultLateral.size() - 1).getMinValue();
                        prevMax = listLogSafeMateResultLateral.get(listLogSafeMateResultLateral.size() - 1).getMaxValue();
                        if (listLogSafeMateResultLateral.size() == 1) {
                            listSafeMateResultLateral.add(new SafeMateResult(listMovingLateral.get(0).getTimestamp(), resultDTW.getEventID(), resultDTW.getScore(), latitudeCurrently, longitudeCurrently, prevMin, prevMax));
                            //UPDATE NUM OF EVENT
                            updateDrivingEvent(resultDTW.getEventID());
                            //RESPONSE
                            responseService();
                            countinuousLateral++;
                        } else {
                            if ((listLogSafeMateResultLateral.get(listLogSafeMateResultLateral.size() - 1).getEventID() != resultDTW.getEventID())) {
                                listSafeMateResultLateral.add(new SafeMateResult(listMovingLateral.get(0).getTimestamp(), resultDTW.getEventID(), resultDTW.getScore(), latitudeCurrently, longitudeCurrently, prevMin, prevMax));
                                //UPDATE NUM OF EVENT
                                updateDrivingEvent(resultDTW.getEventID());
                                //RESPONSE
                                responseService();
                            } else {

                                //UPDATE
                                if (countinuousLateral == Configs.CONT_SKIP_DRIVING_EVENT_LATERAL) {
                                    listSafeMateResultLateral.add(new SafeMateResult(listMovingLateral.get(0).getTimestamp(), resultDTW.getEventID(), resultDTW.getScore(), latitudeCurrently, longitudeCurrently, prevMin, prevMax));
                                    //UPDATE NUM OF EVENT
                                    updateDrivingEvent(resultDTW.getEventID());
                                    //RESPONSE
                                    responseService();
                                    countinuousLateral = 0;
                                }
                                countinuousLateral++;
                            }
                        }
                    }


                    //DTW ALGORITHM LONGITUDINAL
                    if (runDynamicTimeWarpingLongitudinal) {
                        ArrayList<PatternMatchingResult> listResult = new ArrayList<PatternMatchingResult>();
                        //Pattern Matching
                        float scoreL = PatternMatching(patternL, listMovingLongitudinal);
                        float scoreSL = PatternMatching(patternSL, listMovingLongitudinal);
                        float scoreR = PatternMatching(patternR, listMovingLongitudinal);
                        float scoreSR = PatternMatching(patternSR, listMovingLongitudinal);
                        float scoreCL = PatternMatching(patternCL, listMovingLongitudinal);
                        float scoreSCL = PatternMatching(patternSCL, listMovingLongitudinal);
                        float scoreCR = PatternMatching(patternCR, listMovingLongitudinal);
                        float scoreSCR = PatternMatching(patternSCR, listMovingLongitudinal);
                        listResult.add(new PatternMatchingResult(PatternInfo.TURN_LEFT, scoreL));
                        listResult.add(new PatternMatchingResult(PatternInfo.TURN_LEFT_AGGRESSIVE, scoreSL));
                        listResult.add(new PatternMatchingResult(PatternInfo.TURN_RIGHT, scoreR));
                        listResult.add(new PatternMatchingResult(PatternInfo.TURN_RIGHT_AGGRESSIVE, scoreSR));
                        listResult.add(new PatternMatchingResult(PatternInfo.LANECHANGE_LEFT, scoreCL));
                        listResult.add(new PatternMatchingResult(PatternInfo.LANECHANGE_LEFT_AGGRESSIVE, scoreSCL));
                        listResult.add(new PatternMatchingResult(PatternInfo.LANECHANGE_RIGHT, scoreCR));
                        listResult.add(new PatternMatchingResult(PatternInfo.LANECHANGE_RIGHT_AGGRESSIVE, scoreSCR));

                        //find min all
                        PatternMatchingResult resultDTW = MinimumData.minPatternMatchinResult(listResult);

                        //SAVE LOG
                        float minValue = MinimumData.minAxisDataResult(listMovingLongitudinal);
                        float maxValue = MaximumData.maxAxisDataResult(listMovingLongitudinal);
                        listLogSafeMateResultLongitudinal.add(new SafeMateResult(listMovingLongitudinal.get(0).getTimestamp(), resultDTW.getEventID(), resultDTW.getScore(), latitudeCurrently, longitudeCurrently, minValue, maxValue));

                        //UPDATE MERGE
                        float prevMin = 0, prevMax = 0;
                        prevMin = listLogSafeMateResultLongitudinal.get(listLogSafeMateResultLongitudinal.size() - 1).getMinValue();
                        prevMax = listLogSafeMateResultLongitudinal.get(listLogSafeMateResultLongitudinal.size() - 1).getMaxValue();
                        if (listLogSafeMateResultLongitudinal.size() == 1) {
                            listSafeMateResultLongitudinal.add(new SafeMateResult(listMovingLongitudinal.get(0).getTimestamp(), resultDTW.getEventID(), resultDTW.getScore(), latitudeCurrently, longitudeCurrently, prevMin, prevMax));
                            //UPDATE NUM OF EVENT
                            updateDrivingEvent(resultDTW.getEventID());
                            //RESPONSE
                            responseService();
                            countinuousLongitudinal++;
                        } else {
                            if ((listLogSafeMateResultLongitudinal.get(listLogSafeMateResultLongitudinal.size() - 1).getEventID() != resultDTW.getEventID())) {
                                listSafeMateResultLongitudinal.add(new SafeMateResult(listMovingLongitudinal.get(0).getTimestamp(), resultDTW.getEventID(), resultDTW.getScore(), latitudeCurrently, longitudeCurrently, prevMin, prevMax));
                                //UPDATE NUM OF EVENT
                                updateDrivingEvent(resultDTW.getEventID());
                                //RESPONSE
                                responseService();
                            } else {

                                //UPDATE
                                if (countinuousLongitudinal == Configs.CONT_SKIP_DRIVING_EVENT_LONGITUDINAL) {
                                    listSafeMateResultLongitudinal.add(new SafeMateResult(listMovingLongitudinal.get(0).getTimestamp(), resultDTW.getEventID(), resultDTW.getScore(), latitudeCurrently, longitudeCurrently, prevMin, prevMax));
                                    //UPDATE NUM OF EVENT
                                    updateDrivingEvent(resultDTW.getEventID());
                                    //RESPONSE
                                    responseService();
                                    countinuousLongitudinal = 0;
                                }
                                countinuousLongitudinal++;
                            }
                        }

                    }

                    /**********************************************************************************************
                     END PATTERN MATCHING
                     **********************************************************************************************/

                }
                /**********************************************************************************************
                 END AFTER BUFFER DATA
                 **********************************************************************************************/

            }

            START_TIME = currentTimestamp;
            /**********************************************************************************************
             END ALGORITHM
             **********************************************************************************************/
            if (listener != null) {
                listener.onAccelerometerReceive();
            }
        }
/**********************************************************************************************
 END TIME RANGE MS
 **********************************************************************************************/
        long stoptime_process = System.currentTimeMillis();
        time_process = stoptime_process - starttime_process;


    }


    public AxisData switchAxis(long timestamp, float x, float y, float z, int posAxis) {

        if (DEVICE_POSITION == Configs.DEVICEC_HORIZONTAL_FORWARD) {
            //LAT Y A+ B-
            //LNG X L+ R-
            //STD Z U+ B-
            //COLLECT SENSOR DIVIDED BY AXIS
            if (posAxis == 0) {
                return new AxisData(timestamp, y);
            } else if (posAxis == 1) {
                return new AxisData(timestamp, x);
            } else if (posAxis == 2) {
                return new AxisData(timestamp, z);
            }
//            listRawLateral.add(new AxisData(timestamp, y));
//            listRawLongitudinal.add(new AxisData(timestamp, x));
//            listRawStandardLateral.add(new AxisData(timestamp, z));
//            listRawStandardLongitudinal.add(new AxisData(timestamp, z));


        } else if (DEVICE_POSITION == Configs.DEVICEC_VERTICAL_ROOF) {
            //LAT Z A+ B-
            //LNG X L- R+
            //STD Y
            //COLLECT SENSOR DIVIDED BY AXIS
//            listRawLateral.add(new AxisData(timestamp, z));
//            listRawLongitudinal.add(new AxisData(timestamp, -1 * x)); //SWITCH PEAK UP(L) TO DOWN(L)
//            listRawStandardLateral.add(new AxisData(timestamp, y));
//            listRawStandardLongitudinal.add(new AxisData(timestamp, y));
            if (posAxis == 0) {
                return new AxisData(timestamp, z);
            } else if (posAxis == 1) {
                return new AxisData(timestamp, (-1 * x));
            } else if (posAxis == 2) {
                return new AxisData(timestamp, y);
            }
        }
        return null;
    }


    private float PatternMatching(ArrayList<ArrayList<Float>> pattern, ArrayList<AxisData> data) {
        float result = 1000;
        float min_score = 1000;
        for (int i = 0; i < pattern.size(); i++) {
            float score = DynamicTimeWarping.run(data, pattern.get(i));
            if (score < min_score) {
                min_score = score;
            }
        }
        return min_score;
    }

    public double getDistanceMetre() {
        if (Double.isNaN(totalDistance)) {
            return -1;
        } else {
            return totalDistance;
        }

    }

    public int getTravelTime() {
        int totalSecs = TravelTime.travelTimeSecond(START_ALRORITHM_STARTTIME, currentTimestamp);
        //int hours = totalSecs / 3600;
        // int minutes = (totalSecs % 3600) / 60;
        // int seconds = totalSecs % 60;

        // String timeString = String.format("%02d:%02d:%02d", hours, minutes, seconds);
        return totalSecs;
    }


    private void copyArrayList(ArrayList<AxisData> newdata, ArrayList<AxisData> olddata) {
        olddata.clear();
        for (int i = 0; i < newdata.size(); i++) {
            olddata.add(newdata.get(i));
        }
    }


    public void sendGPSSensor(double latitude, double longitude, double speed) {
        double spd = (speed * 3.6); //CONVERT TO KM
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String datetime = formatter.format(new Date(System.currentTimeMillis()));

        //UPDATE TRAVEL INFO
        totalspeed += spd;

        if (numberOfGPS > 0) {
            averageSpeed = totalspeed / (double) numberOfGPS;
        }
        if (spd > maxSpeed) {
            maxSpeed = spd;
        }


        if (numberOfGPS == 1) {
            latitudeSTARTALGORITHM = latitudeCurrently;
            longitudeSTARTALGORITHM = longitudeCurrently;
        }

        if (numberOfGPS >= 2) {
            if (latitudeCurrently == latitude && longitudeCurrently == longitude) {

            } else {
                totalDistance += Distance.gps2m(latitudeCurrently, longitudeCurrently, latitude, longitude);
            }


        }


        OverspeedResult result = overspeedLimit.addData(datetime, spd, latitude, longitude);
        if (result != null) {
            listOverspeedLimit.add(result);
            //UPDATE NUM OF EVENT
            updateDrivingEvent(PatternInfo.OVERSPEEDLIMIT);
            //RESPONSE
            responseService();
        }


        this.latitudeCurrently = latitude;
        this.longitudeCurrently = longitude;
        numberOfGPS++;
    }


    public double getAverageSpeed()

    {
        return averageSpeed;
    }

    public double getMaximumSpeed() {
        return maxSpeed;
    }


    private void initialPattern() {
        ArrayList<PatternData> patterns = new Pattern().getPattern();
        for (int i = 0; i < patterns.size(); i++) {

            if (patterns.get(i).getEvent() == PatternInfo.BRAKE) {
                patternB.add(patterns.get(i).getData());
            } else if (patterns.get(i).getEvent() == PatternInfo.BRAKE_AGGRESSIVE) {
                patternSB.add(patterns.get(i).getData());
            } else if (patterns.get(i).getEvent() == PatternInfo.ACCELERATE) {
                patternA.add(patterns.get(i).getData());
            } else if (patterns.get(i).getEvent() == PatternInfo.ACCELERATE_AGGRESSIVE) {
                patternSA.add(patterns.get(i).getData());
            } else if (patterns.get(i).getEvent() == PatternInfo.TURN_LEFT) {
                patternL.add(patterns.get(i).getData());
            } else if (patterns.get(i).getEvent() == PatternInfo.TURN_LEFT_AGGRESSIVE) {
                patternSL.add(patterns.get(i).getData());
            } else if (patterns.get(i).getEvent() == PatternInfo.TURN_RIGHT) {
                patternR.add(patterns.get(i).getData());
            } else if (patterns.get(i).getEvent() == PatternInfo.TURN_RIGHT_AGGRESSIVE) {
                patternSR.add(patterns.get(i).getData());
            } else if (patterns.get(i).getEvent() == PatternInfo.LANECHANGE_LEFT) {
                patternCL.add(patterns.get(i).getData());
            } else if (patterns.get(i).getEvent() == PatternInfo.LANECHANGE_LEFT_AGGRESSIVE) {
                patternSCL.add(patterns.get(i).getData());
            } else if (patterns.get(i).getEvent() == PatternInfo.LANECHANGE_RIGHT) {
                patternCR.add(patterns.get(i).getData());
            } else if (patterns.get(i).getEvent() == PatternInfo.LANECHANGE_RIGHT_AGGRESSIVE) {
                patternSCR.add(patterns.get(i).getData());
            }


        }

    }

    private void updateDrivingEvent(int eventID) {
        if (eventID == PatternInfo.BRAKE) {
            drivingEvent.setB();
        } else if (eventID == PatternInfo.BRAKE_AGGRESSIVE) {
            drivingEvent.setSb();
        } else if (eventID == PatternInfo.ACCELERATE) {
            drivingEvent.setA();
        } else if (eventID == PatternInfo.ACCELERATE_AGGRESSIVE) {
            drivingEvent.setSa();
        } else if (eventID == PatternInfo.TURN_LEFT) {
            drivingEvent.setL();
        } else if (eventID == PatternInfo.TURN_LEFT_AGGRESSIVE) {
            drivingEvent.setSl();
        } else if (eventID == PatternInfo.TURN_RIGHT) {
            drivingEvent.setR();
        } else if (eventID == PatternInfo.TURN_RIGHT_AGGRESSIVE) {
            drivingEvent.setSr();
        } else if (eventID == PatternInfo.LANECHANGE_LEFT) {
            drivingEvent.setCl();
        } else if (eventID == PatternInfo.LANECHANGE_LEFT_AGGRESSIVE) {
            drivingEvent.setScl();
        } else if (eventID == PatternInfo.LANECHANGE_RIGHT) {
            drivingEvent.setCr();
        } else if (eventID == PatternInfo.LANECHANGE_RIGHT_AGGRESSIVE) {
            drivingEvent.setScr();
        } else if (eventID == PatternInfo.OVERSPEEDLIMIT) {
            drivingEvent.setOverspeedLimit();
        }


    }


    public double getScore() {
        float score = 100;
        long distance = Math.round(totalDistance / 1000);
        SafemateScore safemateScore = new SafemateScore(meanLongitudinal, meanLateral, distance);
        //CALCULATE LATERAL
        for (int i = 0; i < listSafeMateResultLateral.size(); i++) {
            safemateScore.calculateDrivingEventScore(listSafeMateResultLateral.get(i).getEventID(), listSafeMateResultLateral.get(i).getMinValue(), listSafeMateResultLateral.get(i).getMaxValue());
        }
        //CALCULATE LONGITUDINAL
        for (int i = 0; i < listSafeMateResultLongitudinal.size(); i++) {
            safemateScore.calculateDrivingEventScore(listSafeMateResultLongitudinal.get(i).getEventID(), listSafeMateResultLongitudinal.get(i).getMinValue(), listSafeMateResultLongitudinal.get(i).getMaxValue());
        }
        //CALCULATE OVER SPEED LIMIT
        for (int i = 0; i < listOverspeedLimit.size(); i++) {
            safemateScore.calculateOverspeedScore(TravelTime.travelTimeSecond(listOverspeedLimit.get(i).getStartDatetime(), listOverspeedLimit.get(i).getStopDatetime()));
        }
        return safemateScore.getScore();
    }

    private SafemateScore getSafeMateScore() {
        float score = 100;
        long distance = Math.round(totalDistance / 1000);
        SafemateScore safemateScore = new SafemateScore(meanLongitudinal, meanLateral, distance);
        //CALCULATE LATERAL
        for (int i = 0; i < listSafeMateResultLateral.size(); i++) {
            safemateScore.calculateDrivingEventScore(listSafeMateResultLateral.get(i).getEventID(), listSafeMateResultLateral.get(i).getMinValue(), listSafeMateResultLateral.get(i).getMaxValue());
        }
        //CALCULATE LONGITUDINAL
        for (int i = 0; i < listSafeMateResultLongitudinal.size(); i++) {
            safemateScore.calculateDrivingEventScore(listSafeMateResultLongitudinal.get(i).getEventID(), listSafeMateResultLongitudinal.get(i).getMinValue(), listSafeMateResultLongitudinal.get(i).getMaxValue());
        }
        //CALCULATE OVER SPEED LIMIT
        for (int i = 0; i < listOverspeedLimit.size(); i++) {
            safemateScore.calculateOverspeedScore(TravelTime.travelTimeSecond(listOverspeedLimit.get(i).getStartDatetime(), listOverspeedLimit.get(i).getStopDatetime()));
        }
        return safemateScore;
    }


    public String getGrade() {
        SafemateScore safemateScore = new SafemateScore();
        return safemateScore.getGrade();
    }


    public SafeMateResult getCurrentLateralEvent() {
        if (listSafeMateResultLateral.size() > 0) {
            return listSafeMateResultLateral.get(listSafeMateResultLateral.size() - 1);
        }
        return null;
    }

    public SafeMateResult getCurrentLongitudinalEvent() {
        if (listSafeMateResultLongitudinal.size() > 0) {
            return listSafeMateResultLongitudinal.get(listSafeMateResultLongitudinal.size() - 1);
        }
        return null;
    }

    public DrivingEvent getDrivingEvent() {
        return drivingEvent;
    }


    //DEBUG
    public int getNumberOfData() {
        return NumberOfData;
    }


    public ArrayList<AxisData> getListMovingLateral() {
        return listMovingLateral;
    }

    public ArrayList<AxisData> getListMovingLongitudinal() {
        return listMovingLongitudinal;
    }

    public ArrayList<AxisData> getListRawLateral() {
        return listRawLateral;
    }

    public ArrayList<AxisData> getListRawLongitudinal() {
        return listRawLongitudinal;
    }

    public ArrayList<AxisData> getListRawStandardLateral() {
        return listRawStandardLateral;
    }

    public ArrayList<AxisData> getListRawStandardLongitudinal() {
        return listRawStandardLongitudinal;
    }


    public ArrayList<AxisData> getListMovingStandardLateral() {
        return listMovingStandardLateral;
    }

    public ArrayList<AxisData> getListMovingStandardLongitudinal() {
        return listMovingStandardLongitudinal;
    }


    public double meanLongitudinal() {
        return meanLongitudinal;
    }

    public double meanLateral() {
        return meanLateral;
    }

    public double sdLongitudinal() {
        return sdLongitudinal;
    }

    public double sdLateral() {
        return sdLateral;
    }

    public double meanCurrentLongitudinal() {
        return cmeanLongitudinal;
    }

    public double meanCurrentLateral() {
        return cmeanLateral;
    }

    public double sdCurrentLongitudinal() {
        return csdLongitudinal;
    }

    public double sdCurrentLateral() {
        return csdLateral;
    }


    public boolean isRunDTWLateral() {
        return runLt;
    }

    public boolean isRunDTWLongitudinal() {
        return runLg;
    }


    public ArrayList<SafeMateResult> listLogSafeMateResultLateral() {
        return listLogSafeMateResultLateral;
    }

    public ArrayList<SafeMateResult> listLogSafeMateResultLongitudinal() {
        return listLogSafeMateResultLongitudinal;
    }

    public ArrayList<SafeMateResult> listSafeMateResultLateral() {
        return listSafeMateResultLateral;
    }

    public ArrayList<SafeMateResult> listSafeMateResultLongitudinal() {
        return listSafeMateResultLongitudinal;
    }

    public long getTimeProcess() {
        return time_process;
    }


    public double getLatitudeCurrenlty() {
        return latitudeCurrently;
    }

    public double getLongitudeCurrenlty() {
        return longitudeCurrently;
    }

    public ArrayList<OverspeedResult> getListOverspeedLimit() {
        return listOverspeedLimit;
    }

    public float getCurrentX() {
        return curentX;
    }

    public float getCurrentY() {
        return curentY;
    }

    public float getCurrentZ() {
        return curentZ;
    }

    public long getCurrentTimestamp() {
        return currentTimestamp;
    }


    private void responseService() {
        //RESPONSE
        if (listener != null) {
            listener.onDrivingEventDetection(drivingEvent, getSafeMateScore());
        }

    }


    public interface SafeMateServiceListener {


        void onAccelerometerReceive();

        void onGPSReceive();

        void onDrivingEventDetection(DrivingEvent drivingEvent, SafemateScore safemateScore);
    }

}
