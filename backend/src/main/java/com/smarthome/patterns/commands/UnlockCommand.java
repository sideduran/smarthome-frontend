package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.Lock;

/**
 * Concrete Command (Command pattern).
 *
 * This command unlocks a lock device.
 * Only works if the device is actually a Lock type.
 */
public class UnlockCommand implements SmartHomeCommand {

    private final String deviceId;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public UnlockCommand(String deviceId) {
        this.deviceId = deviceId;
    }

    @Override
    public void execute() {
        store.getDevice(deviceId).ifPresent(device -> {
            // Only execute if device is a Lock
            if (device instanceof Lock) {
                Lock lock = (Lock) device;
                lock.setLocked(false);
                store.updateDevice(lock);
            }
        });
    }
}

