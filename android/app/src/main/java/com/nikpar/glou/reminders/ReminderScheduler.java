package com.nikpar.glou.reminders;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import java.util.ArrayList;
import java.util.List;

public final class ReminderScheduler {

    public static final String CHANNEL = "reminders";

    private ReminderScheduler() {}

    static int immutable(int flags) {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? flags | PendingIntent.FLAG_IMMUTABLE : flags;
    }

    private static PendingIntent alarmIntent(Context context, int id, int flags) {
        Intent intent = new Intent(context, ReminderReceiver.class).putExtra(ReminderReceiver.EXTRA_ID, id);
        return PendingIntent.getBroadcast(context, id, intent, immutable(flags));
    }

    public static void ensureChannel(Context context, String name) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager manager = context.getSystemService(NotificationManager.class);
        NotificationChannel channel = new NotificationChannel(CHANNEL, name == null || name.isEmpty() ? "Reminders" : name, NotificationManager.IMPORTANCE_DEFAULT);
        channel.enableVibration(true);
        channel.setShowBadge(false);
        manager.createNotificationChannel(channel);
    }

    public static void arm(Context context, List<ReminderStore.Item> items) {
        AlarmManager alarms = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        long now = System.currentTimeMillis();
        for (ReminderStore.Item item : items) {
            if (item.at <= now) continue;
            PendingIntent intent = alarmIntent(context, item.id, PendingIntent.FLAG_UPDATE_CURRENT);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) alarms.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, item.at, intent);
            else alarms.set(AlarmManager.RTC_WAKEUP, item.at, intent);
        }
    }

    public static void disarm(Context context, List<ReminderStore.Item> items) {
        AlarmManager alarms = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        for (ReminderStore.Item item : items) {
            PendingIntent intent = alarmIntent(context, item.id, PendingIntent.FLAG_NO_CREATE);
            if (intent == null) continue;
            alarms.cancel(intent);
            intent.cancel();
        }
    }

    public static void replace(Context context, List<ReminderStore.Item> items) {
        disarm(context, ReminderStore.items(context));
        ReminderStore.saveItems(context, items);
        arm(context, items);
    }

    public static void quietAfterDrink(Context context, ReminderStore.Logged logged, long now) {
        List<ReminderStore.Item> keep = new ArrayList<>();
        List<ReminderStore.Item> drop = new ArrayList<>();
        String today = ReminderStore.dayKey(now);
        long quietUntil = now + logged.interval * 60_000L;
        boolean goalMet = logged.total >= logged.goal;
        for (ReminderStore.Item item : ReminderStore.items(context)) {
            boolean quiet = item.at < quietUntil || (goalMet && today.equals(ReminderStore.dayKey(item.at)));
            (quiet ? drop : keep).add(item);
        }
        disarm(context, drop);
        ReminderStore.saveItems(context, keep);
    }
}
