package com.nikpar.glou.reminders;

import android.content.Context;
import android.content.SharedPreferences;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public final class ReminderStore {

    static final String PREFS = "glou.reminders";
    static final String STATE_PREFS = "CapacitorStorage";
    static final String STATE_KEY = "glou.state.v1";
    private static final String ITEMS = "items";
    private static final String TEXTS = "texts";

    private ReminderStore() {}

    public static final class Item {

        public final int id;
        public final long at;
        public final String title;
        public final String body;

        public Item(int id, long at, String title, String body) {
            this.id = id;
            this.at = at;
            this.title = title;
            this.body = body;
        }

        JSONObject toJson() throws JSONException {
            return new JSONObject().put("id", id).put("at", at).put("title", title).put("body", body);
        }

        static Item fromJson(JSONObject json) {
            return new Item(json.optInt("id"), json.optLong("at"), json.optString("title"), json.optString("body"));
        }
    }

    private static SharedPreferences prefs(Context context) {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    public static List<Item> items(Context context) {
        List<Item> items = new ArrayList<>();
        try {
            JSONArray array = new JSONArray(prefs(context).getString(ITEMS, "[]"));
            for (int index = 0; index < array.length(); index++) items.add(Item.fromJson(array.getJSONObject(index)));
        } catch (JSONException ignored) {}
        return items;
    }

    public static void saveItems(Context context, List<Item> items) {
        JSONArray array = new JSONArray();
        try {
            for (Item item : items) array.put(item.toJson());
        } catch (JSONException ignored) {}
        prefs(context).edit().putString(ITEMS, array.toString()).apply();
    }

    public static JSONObject texts(Context context) {
        try {
            return new JSONObject(prefs(context).getString(TEXTS, "{}"));
        } catch (JSONException error) {
            return new JSONObject();
        }
    }

    public static void saveTexts(Context context, JSONObject texts) {
        prefs(context).edit().putString(TEXTS, texts.toString()).apply();
    }

    public static String dayKey(long millis) {
        return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date(millis));
    }

    static String isoUtc(long millis) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
        format.setTimeZone(TimeZone.getTimeZone("UTC"));
        return format.format(new Date(millis));
    }

    public static final class Logged {

        public final int total;
        public final int goal;
        public final int interval;
        public final String language;

        Logged(int total, int goal, int interval, String language) {
            this.total = total;
            this.goal = goal;
            this.interval = interval;
            this.language = language;
        }
    }

    public static synchronized Logged addDrink(Context context, int ml, long now) {
        SharedPreferences state = context.getSharedPreferences(STATE_PREFS, Context.MODE_PRIVATE);
        JSONObject root;
        try {
            root = new JSONObject(state.getString(STATE_KEY, "{}"));
        } catch (JSONException error) {
            root = new JSONObject();
        }
        try {
            JSONObject settings = root.optJSONObject("settings");
            if (settings == null) {
                settings = new JSONObject();
                root.put("settings", settings);
            }
            JSONObject days = root.optJSONObject("days");
            if (days == null) {
                days = new JSONObject();
                root.put("days", days);
            }
            String key = dayKey(now);
            JSONArray drinks = days.optJSONArray(key);
            if (drinks == null) {
                drinks = new JSONArray();
                days.put(key, drinks);
            }
            drinks.put(new JSONObject().put("at", isoUtc(now)).put("ml", ml).put("source", "notification"));
            int total = 0;
            for (int index = 0; index < drinks.length(); index++) total += drinks.getJSONObject(index).optInt("ml");
            state.edit().putString(STATE_KEY, root.toString()).commit();
            return new Logged(total, settings.optInt("goal", 4000), settings.optInt("interval", 30), settings.optString("language", "el"));
        } catch (JSONException error) {
            return new Logged(ml, 4000, 30, "el");
        }
    }
}
