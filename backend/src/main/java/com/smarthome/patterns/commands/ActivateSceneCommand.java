package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.Camera;

/**
 * Concrete Command (Command pattern).
 *
 * This command activates a "scene" by delegating to the mediator (through the store).
 * For simplicity it just toggles all devices that belong to the scene.
 */
public class ActivateSceneCommand implements SmartHomeCommand {

    private final String sceneId;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public ActivateSceneCommand(String sceneId) {
        this.sceneId = sceneId;
    }

    @Override
    public void execute() {
        store.getScene(sceneId).ifPresent(scene -> {
            // Activate devices
            scene.getDeviceIds().forEach(deviceId ->
                store.getDevice(deviceId).ifPresent(device -> {
                    device.setOn(true);
                    if (device instanceof Camera) {
                        ((Camera) device).setRecording(true);
                    }
                    store.updateDevice(device);
                })
            );
            
            // Set scene as active
            scene.setActive(true);
            store.updateScene(scene);
        });
    }
}


