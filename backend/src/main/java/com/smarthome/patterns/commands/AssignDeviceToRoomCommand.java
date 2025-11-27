package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.Device;
import com.smarthome.domain.Room;

/**
 * Concrete Command (Command pattern).
 *
 * Assigns a device into the specified room.
 */
public class AssignDeviceToRoomCommand implements SmartHomeCommand {

    private final String deviceId;
    private final String roomId;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public AssignDeviceToRoomCommand(String deviceId, String roomId) {
        this.deviceId = deviceId;
        this.roomId = roomId;
    }

    @Override
    public void execute() {
        store.getDevice(deviceId).ifPresent(device ->
            store.getRoom(roomId).ifPresent(room -> assign(device, room))
        );
    }

    private void assign(Device device, Room targetRoom) {
        // Remove device from its previous room
        if (device.getRoomId() != null) {
            store.getRoom(device.getRoomId()).ifPresent(previousRoom -> {
                previousRoom.removeDevice(deviceId);
                store.updateRoom(previousRoom);
            });
        }

        // Link device to the new room
        targetRoom.addDevice(deviceId);
        device.setRoomId(roomId);

        // Persist changes
        store.updateDevice(device);
        store.updateRoom(targetRoom);
    }
}


