package com.nikpar.glou;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.nikpar.glou.reminders.RemindersPlugin;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(RemindersPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
