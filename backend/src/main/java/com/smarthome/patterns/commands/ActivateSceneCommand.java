package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.*;

/**
 * Concrete Command (Command pattern).
 *
 * This command activates a "scene" by delegating to the mediator (through the store).
 * It executes the specific actions defined in the scene for each device.
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
            scene.getActions().forEach(action -> {
                store.getDevice(action.getDeviceId()).ifPresent(device -> {
                    String type = action.getActionType();
                    if (type != null) {
                        switch (type) {
                            case "TURN_ON":
                                device.setOn(true);
                                break;
                            case "TURN_OFF":
                                device.setOn(false);
                                break;
                            case "LOCK":
                                if (device instanceof Lock) {
                                    ((Lock) device).setLocked(true);
                                }
                                break;
                            case "UNLOCK":
                                if (device instanceof Lock) {
                                    ((Lock) device).setLocked(false);
                                }
                                break;
                            case "RECORD":
                                if (device instanceof Camera) {
                                    ((Camera) device).setRecording(true);
                                }
                                break;
                            case "STOP_RECORDING":
                                if (device instanceof Camera) {
                                    ((Camera) device).setRecording(false);
                                }
                                break;
                            case "SET_TEMP":
                                if (device instanceof Thermostat && action.getValue() != null) {
                                    ((Thermostat) device).setTargetTemperature(action.getValue());
                                }
                                break;
                        }
                        store.updateDevice(device);
                    }
                });
            });
            
            // Set scene as active
            scene.setActive(true);
            store.updateScene(scene);
        });
    }
}
