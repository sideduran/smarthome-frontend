package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;

/**
 * Concrete Command (Command pattern).
 *
 * This command deletes a room by ID.
 */
public class DeleteRoomCommand implements SmartHomeCommand {

    private final String roomId;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public DeleteRoomCommand(String roomId) {
        this.roomId = roomId;
    }

    @Override
    public void execute() {
        store.deleteRoom(roomId);
    }
}

