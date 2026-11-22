package com.nikpar.glou.reminders;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONException;
import org.json.JSONObject;

@CapacitorPlugin(name = "GlouReminders")
public class RemindersPlugin extends Plugin {

    private static WeakReference<RemindersPlugin> active = new WeakReference<>(null);

    @Override
    public void load() {
        active = new WeakReference<>(this);
    }

    static void drinkLogged() {
        RemindersPlugin plugin = active.get();
        if (plugin != null) plugin.notifyListeners("drinkLogged", new JSObject(), true);
    }

    @PluginMethod
    public void schedule(PluginCall call) {
        JSArray array = call.getArray("items", new JSArray());
        JSObject texts = call.getObject("texts", new JSObject());
        List<ReminderStore.Item> items = new ArrayList<>();
        try {
            for (int index = 0; index < array.length(); index++) {
                JSONObject item = array.getJSONObject(index);
                items.add(new ReminderStore.Item(item.getInt("id"), item.getLong("at"), item.optString("title"), item.optString("body")));
            }
        } catch (JSONException error) {
            call.reject("Invalid reminders", error);
            return;
        }
        ReminderStore.saveTexts(getContext(), texts);
        ReminderScheduler.ensureChannel(getContext(), texts.optString("channel"));
        ReminderScheduler.replace(getContext(), items);
        call.resolve();
    }

    @PluginMethod
    public void cancelAll(PluginCall call) {
        ReminderScheduler.replace(getContext(), new ArrayList<>());
        call.resolve();
    }
}
