package com.nikpar.glou.reminders;

import android.app.Notification;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import com.nikpar.glou.MainActivity;
import com.nikpar.glou.R;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import org.json.JSONObject;

public class ReminderReceiver extends BroadcastReceiver {

    public static final String EXTRA_ID = "glou.reminder.id";
    static final int COLOR = 0xFF3A9FD6;
    private static final int EVENING_HOUR = 19;

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
            manager.notify(id, build(context, fired, texts, System.currentTimeMillis()));
        } catch (SecurityException ignored) {}
    }

    static PendingIntent openApp(Context context, int id) {
        Intent open = new Intent(context, MainActivity.class).setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        return PendingIntent.getActivity(context, id, open, ReminderScheduler.immutable(PendingIntent.FLAG_UPDATE_CURRENT));
    }

    static Bitmap face(Context context, int drawable) {
        return BitmapFactory.decodeResource(context.getResources(), drawable);
    }

    static String category(ReminderStore.Logged today, long now) {
        double share = today.goal > 0 ? (double) today.total / today.goal : 0;
        if (share >= 0.75) return "almost";
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(now);
        if (calendar.get(Calendar.HOUR_OF_DAY) >= EVENING_HOUR) return "evening";
        return share < 0.3 ? "low" : "mid";
    }

    private static PendingIntent drink(Context context, int notification, int ml, int request) {
        Intent intent = new Intent(context, DrinkReceiver.class)
            .putExtra(DrinkReceiver.EXTRA_NOTIFICATION, notification)
            .putExtra(DrinkReceiver.EXTRA_ML, ml);
        return PendingIntent.getBroadcast(context, request, intent, ReminderScheduler.immutable(PendingIntent.FLAG_UPDATE_CURRENT));
    }

    private static Notification build(Context context, ReminderStore.Item item, JSONObject texts, long now) {
        ReminderStore.Logged today = ReminderStore.today(context, now);
        String group = category(today, now);
        int seed = ReminderStore.daySeed(now) + item.id;
        String title = ReminderStore.pick(texts, "titles", seed, item.title);
        String body = ReminderStore.pick(texts, group, seed, item.body);
        int left = Math.max(today.goal - today.total, 0);
        String progress = texts.optString("progress", "{total} / {goal}")
            .replace("{total}", DrinkReceiver.formatMl(today.total, today.language))
            .replace("{goal}", DrinkReceiver.formatMl(today.goal, today.language))
            .replace("{left}", DrinkReceiver.formatMl(left, today.language));
        boolean thirsty = "low".equals(group) || "evening".equals(group);
        return new NotificationCompat.Builder(context, ReminderScheduler.CHANNEL)
            .setSmallIcon(R.drawable.ic_stat_glou)
            .setLargeIcon(face(context, thirsty ? R.drawable.glou_thirsty : R.drawable.glou_happy))
            .setColor(COLOR)
            .setContentTitle(title)
            .setContentText(body)
            .setSubText(progress)
            .setStyle(new NotificationCompat.BigTextStyle().bigText(body).setSummaryText(progress))
            .setProgress(Math.max(today.goal, 1), Math.min(today.total, today.goal), false)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)
            .setContentIntent(openApp(context, item.id))
            .addAction(0, texts.optString("small", "+250 ml"), drink(context, item.id, 250, item.id * 10 + 1))
            .addAction(0, texts.optString("large", "+500 ml"), drink(context, item.id, 500, item.id * 10 + 2))
            .build();
    }
}
