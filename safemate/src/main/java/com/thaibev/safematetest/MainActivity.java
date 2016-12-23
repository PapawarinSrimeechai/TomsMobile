package com.thaibev.safematetest;

import android.Manifest;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.text.method.ScrollingMovementMethod;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import java.text.SimpleDateFormat;
import java.util.Date;

import th.in.safemate.safematelib.SafeMate;
import th.in.safemate.safematelib.Utils.SafemateScore;
import th.in.safemate.safematelib.object.DrivingEvent;

public class MainActivity extends AppCompatActivity implements SensorEventListener {

    private static final String TAG = MainActivity.class.getSimpleName();
    private static final int REQUEST_CODE_ACCESS_FINE_AND_COARSE_LOCATION = 1;
    private static final SimpleDateFormat mDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

    //Layout
    private Button mBtnShowDriverScore;
    private TextView mTvDriverScore;

    //SafeMate
    private SafeMate mSafeMate;
    private SensorManager mSensorManager;
    private Location mCurrentLocation;
    private LocationManager mLocationManager;

    private SafeMate.SafeMateServiceListener safeMateServiceListener = new SafeMate.SafeMateServiceListener() {
        @Override
        public void onAccelerometerReceive() {
//            Log.d(TAG, "SafeMate onAccelerometerReceive()");
        }

        @Override
        public void onGPSReceive() {
            Log.d(TAG, "SafeMate onGPSReceive()");
            mTvDriverScore.append("[" + mDateFormat.format(new Date())+ "] -- " + "onGPSReceive()"
                    + "\n--------------------------------------------------------------\n");
        }

        @Override
        public void onDrivingEventDetection(DrivingEvent drivingEvent, SafemateScore safemateScore) {

                mTvDriverScore.append(
                                "[ " + mDateFormat.format(new Date())+ " ] Driving Event:"
                                + "\nDanger break: " + drivingEvent.getSB() + " "
                                + "\nDanger accerate: " + drivingEvent.getSA() + " "
                                + "\nDanger turn-left: " + drivingEvent.getSL() + " "
                                + "\nDanger turn-right: " + drivingEvent.getSR() + " "
                                + "\nDanger change-lane-left: " + drivingEvent.getSCL() + " "
                                + "\nDanger change-lane-right: " + drivingEvent.getSCR() + " "
                                + "\n\nScore: " + safemateScore.getScore()
                                + "\nGrade: " + safemateScore.getGrade()
                                + "\n--------------------------------------------------------------\n"
                );


        }
    };

    // Define a listener that responds to location updates
    private LocationListener mNetworkLocationListener = new LocationListener() {
        public void onLocationChanged(Location location) {
            // Called when a new location is found by the network location provider.
            makeUseOfNewLocation(location);
        }

        public void onStatusChanged(String provider, int status, Bundle extras) {}
        public void onProviderEnabled(String provider) {}
        public void onProviderDisabled(String provider) {}
    };

    private LocationListener mGpsLocationListener = new LocationListener() {
        public void onLocationChanged(Location location) {
            // Called when a new location is found by the network location provider.
            makeUseOfNewLocation(location);
        }

        public void onStatusChanged(String provider, int status, Bundle extras) {}
        public void onProviderEnabled(String provider) {}
        public void onProviderDisabled(String provider) {}
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initLayout();

        //Create SafeMate instance
        mSafeMate = new SafeMate(safeMateServiceListener, getApplicationContext());

        //Create accelometer sensor
        mSensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        mSensorManager.registerListener(this,
                mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER),
                SensorManager.SENSOR_DELAY_NORMAL);

        //Acquire a reference to the system Location Manager
        mLocationManager = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);

        //Request runtime permission for Android 5.0+
        if(isLocationPermissionGrant()){
            requestLocationUpdate();
        }
    }

    private void initLayout() {
        mBtnShowDriverScore = (Button) findViewById(R.id.btnShowDriverScore);
        mTvDriverScore = (TextView) findViewById(R.id.tvDriverScore);
        mTvDriverScore.setMovementMethod(new ScrollingMovementMethod());

        mBtnShowDriverScore.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(mSafeMate != null){

                    AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
                    builder.setTitle("Driver Score")
                            .setMessage(
                                    "[ " + mDateFormat.format(new Date())+ " ] Summary:"
                                            + "\nDistance: " + mSafeMate.getDistanceMetre() + " meters"
                                            + "\nTravel time: " + mSafeMate.getTravelTime()/60 + " minutes"
                                            + "\nAverage speed: " + mSafeMate.getAverageSpeed()+ " km/h"
                                            + "\nMaximun speed: " + mSafeMate.getMaximumSpeed()+ " km/h"
                                            + "\n\nDanger break: " + mSafeMate.getDrivingEvent().getSB() + " times"
                                            + "\nDanger accerate: " + mSafeMate.getDrivingEvent().getSA() + " times"
                                            + "\nDanger turn-left: " + mSafeMate.getDrivingEvent().getSL() + " times"
                                            + "\nDanger turn-right: " + mSafeMate.getDrivingEvent().getSR() + " times"
                                            + "\nDanger change-lane-left: " + mSafeMate.getDrivingEvent().getSCL() + " times"
                                            + "\nDanger change-lane-right: " + mSafeMate.getDrivingEvent().getSCR() + " times"
                                            + "\nOver speed limit: " + mSafeMate.getDrivingEvent().getOverspeedLimit() + " times"
                                            + "\n\nScore: " + mSafeMate.getScore()
                                            + "\nGrade: " + mSafeMate.getGrade())
                            .setNeutralButton("Close", new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialogInterface, int i) {
                                    dialogInterface.dismiss();
                                }
                            }).create().show();
                }
            }
        });
    }


    private boolean isLocationPermissionGrant() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {

            // Should we show an explanation?
            if (ActivityCompat.shouldShowRequestPermissionRationale(this,
                    Manifest.permission.ACCESS_FINE_LOCATION)
                    || ActivityCompat.shouldShowRequestPermissionRationale(this,
                    Manifest.permission.ACCESS_COARSE_LOCATION)) {

                // Show an explanation to the user *asynchronously* -- don't block
                // this thread waiting for the user's response! After the user
                // sees the explanation, try again to request the permission.
                AlertDialog.Builder builder = new AlertDialog.Builder(this);
                Dialog dialog = builder.setTitle("Notice")
                        .setMessage("App need to access your GPS data")
                        .setNeutralButton("OK", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                dialogInterface.dismiss();
                                //Request the permission.
                                //See the request permission's result in Avtivity#onRequestPermissionsResult()
                                ActivityCompat.requestPermissions(MainActivity.this,
                                        new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},
                                        REQUEST_CODE_ACCESS_FINE_AND_COARSE_LOCATION);
                            }
                        })
                        .create();
                dialog.show();

            } else {
                // No explanation needed, we can request the permission.
                // See the request permission's result in Avtivity#onRequestPermissionsResult()
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},
                        REQUEST_CODE_ACCESS_FINE_AND_COARSE_LOCATION);
            }
            return false;
        }

        return true;
    }

    private void requestLocationUpdate() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {

            mLocationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 1000, 1, mNetworkLocationListener);
            mLocationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 1, mGpsLocationListener);
        }
    }

    private void makeUseOfNewLocation(Location newLocation) {
//        if (isBetterLocation(newLocation, mCurrentLocation)) {
            mCurrentLocation = newLocation;
//        }

        mTvDriverScore.append( "[ " + mDateFormat.format(new Date())+ " ] Location change: (" + newLocation.getProvider() + ")"
                + "\nLat: " + mCurrentLocation.getLatitude()
                + "\nLng: " +mCurrentLocation.getLongitude()
                + "\nSpeed: " +mCurrentLocation.getSpeed() + " meters/second"
                + "\n--------------------------------------------------------------\n");
        mSafeMate.sendGPSSensor(mCurrentLocation.getLatitude(),
                mCurrentLocation.getLongitude(),
                mCurrentLocation.getSpeed());

    }

    private static final int TWO_MINUTES = 1000 * 60 * 2;
    private static final int HALF_MINUTE = 1000 * 30;
    private static final int ONE_SEC = 1000 ;

    /** Determines whether one Location reading is better than the current Location fix
     * @param location  The new Location that you want to evaluate
     * @param currentBestLocation  The current Location fix, to which you want to compare the new one
     */
    protected boolean isBetterLocation(Location location, Location currentBestLocation) {
        if (currentBestLocation == null) {
            // A new location is always better than no location
            return true;
        }

        // Check whether the new location fix is newer or older
        long timeDelta = location.getTime() - currentBestLocation.getTime();
        Log.i(TAG, "Time Diff: " + timeDelta);
        boolean isSignificantlyNewer = timeDelta > ONE_SEC;
        boolean isSignificantlyOlder = timeDelta < -ONE_SEC;
        boolean isNewer = timeDelta > 0;

        // If it's been more than two minutes since the current location, use the new location
        // because the user has likely moved
        if (isSignificantlyNewer) {
            return true;
            // If the new location is more than two minutes older, it must be worse
        } else if (isSignificantlyOlder) {
            return false;
        }

        // Check whether the new location fix is more or less accurate
        int accuracyDelta = (int) (location.getAccuracy() - currentBestLocation.getAccuracy());
        boolean isLessAccurate = accuracyDelta > 0;
        boolean isMoreAccurate = accuracyDelta < 0;
        boolean isSignificantlyLessAccurate = accuracyDelta > 200;

        // Check if the old and new location are from the same provider
        boolean isFromSameProvider = isSameProvider(location.getProvider(),
                currentBestLocation.getProvider());

        // Determine location quality using a combination of timeliness and accuracy
        if (isMoreAccurate) {
            return true;
        } else if (isNewer && !isLessAccurate) {
            return true;
        } else if (isNewer && !isSignificantlyLessAccurate && isFromSameProvider) {
            return true;
        }
        return false;
    }

    /** Checks whether two providers are the same */
    private boolean isSameProvider(String provider1, String provider2) {
        if (provider1 == null) {
            return provider2 == null;
        }
        return provider1.equals(provider2);
    }

    @Override
    public void onSensorChanged(SensorEvent sensorEvent) {
        //Send accelometer sensor to SafeMate
        if (sensorEvent.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            float[] values = sensorEvent.values;

            float x = values[0];
            float y = values[1];
            float z = values[2];

            mSafeMate.sendAccelerometerSensor(x, y, z);
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int i) {

    }

    @Override
    protected void onDestroy() {
        //Remove location update
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            if(mLocationManager != null) {
                mLocationManager.removeUpdates(mNetworkLocationListener);
                mLocationManager.removeUpdates(mGpsLocationListener);
            }
        }

        super.onDestroy();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        for (int i = 0; i < permissions.length; i++) {
            Log.i(TAG, "Permissions : " + permissions[i] );
        }
        for (int i = 0; i < grantResults.length; i++) {
            Log.i(TAG, "GrantResults : " + grantResults[i]);
        }

        switch (requestCode){
            case REQUEST_CODE_ACCESS_FINE_AND_COARSE_LOCATION:
                // If request is cancelled, the result arrays are empty.
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    for (int i = 0; i < permissions.length; i++) {

                        Log.i(TAG, "Permissions : " + permissions[i]
                                + " was granted: " + (grantResults[i] == PackageManager.PERMISSION_GRANTED));
                    }
                } else {

                    // permission denied
                    // functionality that depends on this permission.
                    Log.w(TAG, "FINE & COARSE LOCATION was not granted");
                }

                if(isLocationPermissionGrant()){
                    requestLocationUpdate();
                }
            break;

            default:super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }
}
