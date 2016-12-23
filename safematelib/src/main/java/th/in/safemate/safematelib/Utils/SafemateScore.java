package th.in.safemate.safematelib.Utils;

import th.in.safemate.safematelib.contants.PatternInfo;

/**
 * Created by thuny on 05/09/2016.
 */
public class SafemateScore {


    private int time_limit = 45;
    private double meanLongitudinal;
    private double meanLateral;
    private double distanceKM = 1;


    //Statistics 100% x 100% of driving ev accident
    private float point_overspeed = (2.19f * 2);
    private float point_sc = (2.38f * 1.5f);
    private float point_sb = (1.69f * 1.5f);
    private float point_su = (0.44f * 1.5f);
    private float point_sa = (0.44f * 1.5f);
    private float point_st = (0.44f * 1.5f);

    //SCORE
    private double score_overspeed = 0;
    private double score_event = 0;

    //ACCELEROMETER DATA VALUE FROM PATTERNS
    private double max_sl = -3.405087;
    private double max_sr = 5.3936577;
    private double max_scl = -7.804459;
    private double max_scr = 5.202973;
    private double max_su = 6.1291566;
    private double max_sb = -7.572913;
    private double max_sa = 7.8861814;

    public SafemateScore()
    {}

    public SafemateScore(double meanLongitudinal, double meanLateral, double distanceKM) {
        this.meanLongitudinal = meanLongitudinal;
        this.meanLateral = meanLateral;
        this.distanceKM = distanceKM;
    }


    public void calculateDrivingEventScore(int eventID, float minValue, float maxValue) {
        double result = 0;
        //WEIGHT AGGRESSIVE EVENT
        result = getScale(eventID, minValue, maxValue) * getPoint(eventID);
        score_event += result;
    }


    public void calculateOverspeedScore(long secondtime) {

        double result = 0;
        int section = (int) ((secondtime) / time_limit);
        result = (point_overspeed) * section;
        score_overspeed += result;
    }


    public double getScore() {

        if(distanceKM == 0)
        {
            return  (100 - ((score_overspeed + score_event)));
        }

        return (100 - ((score_overspeed + score_event)/ distanceKM));
    }





    private float getPoint(int eventID) {
        switch (eventID) {
            case PatternInfo.TURN_LEFT_AGGRESSIVE:
            case PatternInfo.TURN_RIGHT_AGGRESSIVE:
                return point_st;
            case PatternInfo.LANECHANGE_LEFT_AGGRESSIVE:
            case PatternInfo.LANECHANGE_RIGHT_AGGRESSIVE:
                return point_sc;
            case PatternInfo.UTURN_AGGRESSIVE:
                return point_su;
            case PatternInfo.BRAKE_AGGRESSIVE:
                return point_sb;
            case PatternInfo.ACCELERATE_AGGRESSIVE:
                return point_sa;
            default:
                return 0;
        }
    }

    private float getScale(int eventID, float minValue, float maxValue) {

        //UP PEAKS
        if (eventID == PatternInfo.TURN_LEFT_AGGRESSIVE || eventID == PatternInfo.LANECHANGE_LEFT_AGGRESSIVE || eventID == PatternInfo.UTURN_AGGRESSIVE || eventID == PatternInfo.BRAKE_AGGRESSIVE) {
            double s = (Math.abs(getMax(eventID)) - meanLongitudinal);
            if (eventID == PatternInfo.BRAKE_AGGRESSIVE) {
                s = (Math.abs(getMax(eventID)) - meanLateral);
            }
            float data = (float) (s / 4);
            return getWeight((float) (((Math.abs(minValue)) / data)));

        } else if (eventID == PatternInfo.TURN_RIGHT_AGGRESSIVE || eventID == PatternInfo.LANECHANGE_RIGHT_AGGRESSIVE || eventID == PatternInfo.ACCELERATE_AGGRESSIVE) { //DOWN PEAKS
            double s = (Math.abs(getMax(eventID)) - meanLongitudinal);
            if (PatternInfo.ACCELERATE_AGGRESSIVE == 12) {
                s = (Math.abs(getMax(eventID)) - meanLateral);
            }
            float data = (float) (s / 4);
            return getWeight((float) (((Math.abs(maxValue)) / data)));
        } else {
            return 0;
        }
    }

    private float getWeight(float data) {
        if (data >= 4) {
            return 1.0f;
        } else if (data < 4 && data >= 3) {
            return 0.75f;
        } else if (data < 3 && data >= 2) {
            return 0.5f;
        } else {
            return 0.25f;
        }
    }


    private double getMax(int eventID) {
        switch (eventID) {
            case PatternInfo.TURN_LEFT_AGGRESSIVE:
                return max_sl;
            case PatternInfo.TURN_RIGHT_AGGRESSIVE:
                return max_sr;
            case PatternInfo.LANECHANGE_LEFT_AGGRESSIVE:
                return max_scl;
            case PatternInfo.LANECHANGE_RIGHT_AGGRESSIVE:
                return max_scr;
            case PatternInfo.UTURN_AGGRESSIVE:
                return max_su;
            case PatternInfo.BRAKE_AGGRESSIVE:
                return max_sb;
            case PatternInfo.ACCELERATE_AGGRESSIVE:
                return max_sa;
            default:
                return 0;
        }
    }





    public String getGrade() {
        double score = getScore();
		/*
		 * A = 80-100 B = 70-79 C = 60-69 D = 50-59 E = 40-49 F = 30-39
		 */
        if (score >= 80) {
            return "A";
        } else if (score >= 70 && score <= 79) {
            return "B";
        } else if (score >= 60 && score <= 69) {
            return "C";
        } else if (score >= 50 && score <= 59) {
            return "D";
        } else if (score == -1) {
            return "";
        } else {
            return "F";
        }
    }






}
