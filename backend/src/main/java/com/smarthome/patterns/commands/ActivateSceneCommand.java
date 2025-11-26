package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;

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
        store.getScene(sceneId).ifPresent(scene ->
            scene.getDeviceIds().forEach(deviceId ->
                store.getDevice(deviceId).ifPresent(device -> {
                    device.setOn(true);
                    store.updateDevice(device);
                })
            )
        );
    }
}


