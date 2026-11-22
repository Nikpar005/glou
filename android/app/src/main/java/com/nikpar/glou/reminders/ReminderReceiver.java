package com.nikpar.glou.reminders;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import com.nikpar.glou.MainActivity;
import com.nikpar.glou.R;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONObject;

public class ReminderReceiver extends BroadcastReceiver {

    public static final String EXTRA_ID = "glou.reminder.id";
    static final int COLOR = 0xFF0E7C9B;

    @Override
    public void onReceive(Context context, Intent intent) {
        int id = intent.getIntExtra(EXTRA_ID, -1);
        List<ReminderStore.Item> rest = new ArrayList<>();
        ReminderStore.Item fired = null;
        for (ReminderStore.Item item : ReminderStore.items(context)) {
            if (item.id == id) fired = item;
            else rest.add(item);
        }
        ReminderStore.saveItems(context, rest);
        if (fired == null) return;
        NotificationManagerCompat manager = NotificationManagerCompat.from(context);
        if (!manager.areNotificationsEnabled()) return;
        JSONObject texts = ReminderStore.texts(context);
        ReminderScheduler.ensureChannel(context, texts.optString("channel"));
        manager.cancelAll();
        try {
            manager.notify(id, build(context, fired, texts.optString("action", "+250 ml")));
        } catch (SecurityException ignored) {}
    }

    static PendingIntent openApp(Context context, int id) {
        Intent open = new Intent(context, MainActivity.class).setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        return PendingIntent.getActivity(context, id, open, ReminderScheduler.immutable(PendingIntent.FLAG_UPDATE_CURRENT));
    }

    private static android.app.Notification build(Context context, ReminderStore.Item item, String actionTitle) {
        Intent drink = new Intent(context, DrinkReceiver.class).putExtra(DrinkReceiver.EXTRA_NOTIFICATION, item.id).putExtra(DrinkReceiver.EXTRA_ML, 250);
        PendingIntent drinkIntent = PendingIntent.getBroadcast(context, item.id, drink, ReminderScheduler.immutable(PendingIntent.FLAG_UPDATE_CURRENT));
        return new NotificationCompat.Builder(context, ReminderScheduler.CHANNEL)
            .setSmallIcon(R.drawable.ic_stat_glou)
            .setColor(COLOR)
            .setContentTitle(item.title)
            .setContentText(item.body)
            .setStyle(new NotificationCompat.BigTextStyle().bigText(item.body))
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)
            .setContentIntent(openApp(context, item.id))
            .addAction(0, actionTitle, drinkIntent)
            .build();
    }
}
