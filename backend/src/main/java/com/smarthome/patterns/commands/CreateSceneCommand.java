package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.Scene;

/**
 * Concrete Command (Command pattern).
 *
 * This command creates a new scene.
 */
public class CreateSceneCommand implements SmartHomeCommand {

    private final Scene scene;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public CreateSceneCommand(Scene scene) {
        this.scene = scene;
    }

    @Override
    public void execute() {
        store.addScene(scene);
    }
}

