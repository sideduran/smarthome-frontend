package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;

/**
 * Concrete Command (Command pattern).
 *
 * This command deletes a scene by ID.
 */
public class DeleteSceneCommand implements SmartHomeCommand {

    private final String sceneId;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public DeleteSceneCommand(String sceneId) {
        this.sceneId = sceneId;
    }

    @Override
    public void execute() {
        store.deleteScene(sceneId);
    }
}

