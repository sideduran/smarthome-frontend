package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.Room;

/**
 * Concrete Command (Command pattern).
 *
 * This command creates a new room.
 */
public class CreateRoomCommand implements SmartHomeCommand {

    private final Room room;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public CreateRoomCommand(Room room) {
        this.room = room;
    }

    @Override
    public void execute() {
        store.addRoom(room);
    }
}

