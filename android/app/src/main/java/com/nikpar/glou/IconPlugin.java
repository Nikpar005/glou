package com.nikpar.glou;

import android.content.ComponentName;
import android.content.pm.PackageManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "GlouIcon")
public class IconPlugin extends Plugin {

    private static final String[] ICONS = { "classic", "night", "sunset", "mint" };

    private ComponentName alias(String icon) {
        String name = "Icon" + Character.toUpperCase(icon.charAt(0)) + icon.substring(1);
        return new ComponentName(getContext(), getContext().getPackageName() + "." + name);
    }

    @PluginMethod
    public void current(PluginCall call) {
        PackageManager manager = getContext().getPackageManager();
        String current = "classic";
        for (String icon : ICONS) {
            int state = manager.getComponentEnabledSetting(alias(icon));
            if (state == PackageManager.COMPONENT_ENABLED_STATE_ENABLED) current = icon;
        }
        JSObject result = new JSObject();
        result.put("icon", current);
        call.resolve(result);
    }

    @PluginMethod
    public void set(PluginCall call) {
        String chosen = call.getString("icon", "classic");
        boolean known = false;
        for (String icon : ICONS) known |= icon.equals(chosen);
        if (!known) {
            call.reject("Unknown icon");
            return;
        }
        PackageManager manager = getContext().getPackageManager();
        manager.setComponentEnabledSetting(alias(chosen), PackageManager.COMPONENT_ENABLED_STATE_ENABLED, PackageManager.DONT_KILL_APP);
        for (String icon : ICONS) {
            if (icon.equals(chosen)) continue;
            manager.setComponentEnabledSetting(alias(icon), PackageManager.COMPONENT_ENABLED_STATE_DISABLED, PackageManager.DONT_KILL_APP);
        }
        call.resolve();
    }
}
