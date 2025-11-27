package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.Camera;

/**
 * Concrete Command (Command pattern).
 *
 * Starts recording on a camera device.
 */
public class StartRecordingCommand implements SmartHomeCommand {

    private final String deviceId;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public StartRecordingCommand(String deviceId) {
        this.deviceId = deviceId;
    }

    @Override
    public void execute() {
        store.getDevice(deviceId).ifPresent(device -> {
            if (device instanceof Camera) {
                Camera camera = (Camera) device;
                camera.setRecording(true);
                store.updateDevice(camera);
            }
        });
    }
}


