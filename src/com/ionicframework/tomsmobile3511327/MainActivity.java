/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.ionicframework.tomsmobile3511327;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import org.apache.cordova.*;

import th.in.safemate.safematelib.SafeMate;
import th.in.safemate.safematelib.Utils.SafemateScore;
import th.in.safemate.safematelib.object.DrivingEvent;

public class MainActivity extends CordovaActivity implements SensorEventListener {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // Set by <content src="index.html" /> in config.xml
    loadUrl(launchUrl);
  }

  @Override
  public void onSensorChanged(SensorEvent event) {

  }

  @Override
  public void onAccuracyChanged(Sensor sensor, int accuracy) {

  }
}
