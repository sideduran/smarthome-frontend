package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.Scene;

/**
 * Concrete Command (Command pattern).
 *
 * This command updates an existing scene.
 */
public class UpdateSceneCommand implements SmartHomeCommand {

    private final Scene scene;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public UpdateSceneCommand(Scene scene) {
        this.scene = scene;
    }

    @Override
    public void execute() {
        store.updateScene(scene);
    }
}

