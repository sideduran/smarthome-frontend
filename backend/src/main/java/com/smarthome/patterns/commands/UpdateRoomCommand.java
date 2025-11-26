package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.Room;

/**
 * Concrete Command (Command pattern).
 *
 * This command updates an existing room.
 */
public class UpdateRoomCommand implements SmartHomeCommand {

    private final Room room;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public UpdateRoomCommand(Room room) {
        this.room = room;
    }

    @Override
    public void execute() {
        store.updateRoom(room);
    }
}

