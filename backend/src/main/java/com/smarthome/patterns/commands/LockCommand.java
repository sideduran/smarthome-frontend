package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.Lock;

/**
 * Concrete Command (Command pattern).
 *
 * This command locks a lock device.
 * Only works if the device is actually a Lock type.
 */
public class LockCommand implements SmartHomeCommand {

    private final String deviceId;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public LockCommand(String deviceId) {
        this.deviceId = deviceId;
    }

    @Override
    public void execute() {
        store.getDevice(deviceId).ifPresent(device -> {
            // Only execute if device is a Lock
            if (device instanceof Lock) {
                Lock lock = (Lock) device;
                lock.setLocked(true);
                store.updateDevice(lock);
            }
        });
    }
}

