package com.nikpar.glou.reminders;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import com.nikpar.glou.R;
import java.text.NumberFormat;
import java.util.Locale;
import org.json.JSONObject;

public class DrinkReceiver extends BroadcastReceiver {

    public static final String EXTRA_NOTIFICATION = "glou.drink.notification";
    public static final String EXTRA_ML = "glou.drink.ml";
    private static final long CONFIRM_MS = 4000;

    @Override
    public void onReceive(Context context, Intent intent) {
        int notification = intent.getIntExtra(EXTRA_NOTIFICATION, 0);
        int ml = intent.getIntExtra(EXTRA_ML, 250);
        long now = System.currentTimeMillis();
        ReminderStore.Logged logged = ReminderStore.addDrink(context, ml, now);
        ReminderScheduler.quietAfterDrink(context, logged, now);
        RemindersPlugin.drinkLogged();
        if (!confirm(context, notification, logged) || Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) return;
        PendingResult pending = goAsync();
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            NotificationManagerCompat.from(context).cancel(notification);
            pending.finish();
        }, CONFIRM_MS);
    }

    static String formatMl(int ml, String language) {
        if (ml < 1000) return ml + " ml";
        NumberFormat format = NumberFormat.getNumberInstance("el".equals(language) ? new Locale("el", "GR") : Locale.UK);
        format.setMaximumFractionDigits(2);
        return format.format(ml / 1000.0) + " L";
    }

    private static boolean confirm(Context context, int id, ReminderStore.Logged logged) {
        NotificationManagerCompat manager = NotificationManagerCompat.from(context);
        JSONObject texts = ReminderStore.texts(context);
        boolean done = logged.total >= logged.goal;
        String title = done ? texts.optString("doneTitle", "Goal reached") : texts.optString("loggedTitle", "+250 ml");
        String body = texts.optString("loggedBody", "{total} / {goal}")
            .replace("{total}", formatMl(logged.total, logged.language))
            .replace("{goal}", formatMl(logged.goal, logged.language));
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, ReminderScheduler.CHANNEL)
            .setSmallIcon(R.drawable.ic_stat_glou)
            .setColor(ReminderReceiver.COLOR)
            .setContentTitle(title)
            .setContentText(body)
            .setProgress(logged.goal, Math.min(logged.total, logged.goal), false)
            .setOnlyAlertOnce(true)
            .setSilent(true)
            .setAutoCancel(true)
            .setContentIntent(ReminderReceiver.openApp(context, id))
            .setTimeoutAfter(CONFIRM_MS);
        try {
            manager.notify(id, builder.build());
        } catch (SecurityException error) {
            manager.cancel(id);
            return false;
        }
        return true;
    }
}
