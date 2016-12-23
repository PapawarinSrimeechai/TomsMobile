package com.ionicframework.tomsmobile3511327;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

/**
 * Created by MIW-PC on 21/12/2559.
 */

public class Sql extends SQLiteOpenHelper {
  //Database version
  private static final int DATABASE_VERSION = 1 ;
  //Database Name
  private static final String DATABASE_NAME = "mySQL";
  //Table Name
  private static final String TABLE_NAME = "safemate";

  public Sql(Context context) {
    super(context, DATABASE_NAME, null, DATABASE_VERSION);
  }

  @Override
  public void onCreate(SQLiteDatabase db) {
    db.execSQL("CREATE TABLE "+TABLE_NAME+" (id_safemate VARCHAR(15) PRIMARYKEY AUTOINCREMENT,"+ " Speed INTEGER);");

    Log.d("Create Table","Create table Success");
  }

  @Override
  public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

  }
}
