package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.Camera;
import com.smarthome.domain.Lock;

/**
 * Concrete Command (Command pattern).
 *
 * This command sets the security system status (armed/disarmed).
 * When arming, it also locks all locks and starts recording on all cameras.
 */
public class SetSecurityStatusCommand implements SmartHomeCommand {

    private final String status;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public SetSecurityStatusCommand(String status) {
        this.status = status;
    }

    @Override
    public void execute() {
        store.setSecurityStatus(status);

        if ("armed".equals(status)) {
            store.getDevices().forEach(device -> {
                if (device instanceof Lock) {
                    Lock lock = (Lock) device;
                    lock.setLocked(true);
                    store.updateDevice(lock);
                } else if (device instanceof Camera) {
                    Camera camera = (Camera) device;
                    camera.setRecording(true);
                    store.updateDevice(camera);
                }
            });
        }
    }
}

