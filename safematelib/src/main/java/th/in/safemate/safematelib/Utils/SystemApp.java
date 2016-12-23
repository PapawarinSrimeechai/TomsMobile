package th.in.safemate.safematelib.Utils;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.preference.PreferenceManager;

public class SystemApp {

	Context ctx;

	public SystemApp(Context ctx) {
		this.ctx = ctx;

	}

	public void saveFirst(long data) {

		SharedPreferences prefs = PreferenceManager
				.getDefaultSharedPreferences(ctx);
		Editor medit = prefs.edit();
		medit.putLong("first_time", data);
		medit.commit();
	}

	public long getFirst() {
		SharedPreferences pref = PreferenceManager
				.getDefaultSharedPreferences(ctx);
		long data = pref.getLong("first_time", 10001);
		return data;
	}

	public int getLim() { //long timestamp
		SharedPreferences pref = PreferenceManager
				.getDefaultSharedPreferences(ctx);
		int data = pref.getInt("lim", (90*24*60*60*1000));
		return data;
	}



}
