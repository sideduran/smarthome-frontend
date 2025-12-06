package com.smarthome.config;

import com.smarthome.domain.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Singleton pattern example.
 *
 * This class is an explicit **Singleton** (in addition to Spring beans usually
 * being singletons by default). It acts as a very simple in-memory "database"
 * shared by all services.
 */
public class InMemoryStateStore {

    // --- Singleton pattern boilerplate (lazy, thread-safe) ---
    private static volatile InMemoryStateStore INSTANCE;

    private InMemoryStateStore() {
        bootstrap();
    }

    public static InMemoryStateStore getInstance() {
        if (INSTANCE == null) {
            synchronized (InMemoryStateStore.class) {
                if (INSTANCE == null) {
                    INSTANCE = new InMemoryStateStore();
                }
            }
        }
        return INSTANCE;
    }
    // --- end Singleton boilerplate ---

    private final Map<String, Device> devices = new ConcurrentHashMap<>();
    private final Map<String, Scene> scenes = new ConcurrentHashMap<>();
    private final Map<String, Room> rooms = new ConcurrentHashMap<>();
    private final Map<String, Automation> automations = new ConcurrentHashMap<>();
    private final List<ActivityLog> activityLogs = Collections.synchronizedList(new ArrayList<>());
    private String securityStatus = "disarmed";

    private void bootstrap() {
        // Create rooms first
        Room livingRoom = new Room("room-living", "Living Room", "Main living area");
        Room bedroom = new Room("room-bedroom", "Master Bedroom", "Main bedroom");
        Room kitchen = new Room("room-kitchen", "Kitchen", "Kitchen area");
        rooms.put(livingRoom.getId(), livingRoom);
        rooms.put(bedroom.getId(), bedroom);
        rooms.put(kitchen.getId(), kitchen);

        // Create devices using inheritance (Thermostat, Light, Lock, Camera extend Device)
        Light livingRoomLight = new Light("light-1", "Living Room Light");
        Light bedroomLight = new Light("light-2", "Bedroom Light");
        Thermostat livingRoomThermostat = new Thermostat("thermostat-1", "Living Room Thermostat");
        Thermostat bedroomThermostat = new Thermostat("thermostat-2", "Bedroom Thermostat");
        Lock frontDoorLock = new Lock("lock-1", "Living Room Door Lock", true, livingRoom.getId());
        Lock bedroomLock = new Lock("lock-2", "Bedroom Door Lock", true, bedroom.getId());
        Camera livingRoomCamera = new Camera("camera-1", "Living Room Camera", true, livingRoom.getId());
        Camera kitchenCamera = new Camera("camera-2", "Kitchen Camera", true, kitchen.getId());

        // Store devices
        devices.put(livingRoomLight.getId(), livingRoomLight);
        devices.put(bedroomLight.getId(), bedroomLight);
        devices.put(livingRoomThermostat.getId(), livingRoomThermostat);
        devices.put(bedroomThermostat.getId(), bedroomThermostat);
        devices.put(frontDoorLock.getId(), frontDoorLock);
        devices.put(bedroomLock.getId(), bedroomLock);
        devices.put(livingRoomCamera.getId(), livingRoomCamera);
        devices.put(kitchenCamera.getId(), kitchenCamera);

        // Add devices to rooms
        livingRoom.addDevice(livingRoomLight.getId());
        livingRoom.addDevice(livingRoomThermostat.getId());
        livingRoom.addDevice(frontDoorLock.getId());
        livingRoom.addDevice(livingRoomCamera.getId());
        bedroom.addDevice(bedroomLight.getId());
        bedroom.addDevice(bedroomThermostat.getId());
        bedroom.addDevice(bedroomLock.getId());
        kitchen.addDevice(kitchenCamera.getId());

        // Create scenes
        Scene evening = new Scene("scene-evening", "Evening mode", List.of(livingRoomLight.getId(), livingRoomThermostat.getId()));
        scenes.put(evening.getId(), evening);
    }

    public Collection<Device> getDevices() {
        return devices.values();
    }

    public Optional<Device> getDevice(String id) {
        return Optional.ofNullable(devices.get(id));
    }

    public void updateDevice(Device device) {
        devices.put(device.getId(), device);
    }

    public Collection<Scene> getScenes() {
        return scenes.values();
    }

    public Optional<Scene> getScene(String id) {
        return Optional.ofNullable(scenes.get(id));
    }

    public Collection<Room> getRooms() {
        return rooms.values();
    }

    public Optional<Room> getRoom(String id) {
        return Optional.ofNullable(rooms.get(id));
    }

    public void addRoom(Room room) {
        rooms.put(room.getId(), room);
    }

    public void updateRoom(Room room) {
        rooms.put(room.getId(), room);
    }

    public boolean deleteRoom(String id) {
        Room removed = rooms.remove(id);
        if (removed != null) {
            // Remove room reference from devices
            devices.values().forEach(device -> {
                if (id.equals(device.getRoomId())) {
                    device.setRoomId(null);
                }
            });
        }
        return removed != null;
    }

    public void addDevice(Device device) {
        devices.put(device.getId(), device);
        // Add device to room if roomId is set
        if (device.getRoomId() != null) {
            getRoom(device.getRoomId()).ifPresent(room -> room.addDevice(device.getId()));
        }
    }

    public boolean deleteDevice(String id) {
        Device removed = devices.remove(id);
        if (removed != null) {
            // Remove device from its room
            if (removed.getRoomId() != null) {
                getRoom(removed.getRoomId()).ifPresent(room -> room.removeDevice(id));
            }
            // Remove device from all scenes
            scenes.values().forEach(scene -> scene.getDeviceIds().remove(id));
        }
        return removed != null;
    }

    public void addScene(Scene scene) {
        scenes.put(scene.getId(), scene);
    }

    public void updateScene(Scene scene) {
        scenes.put(scene.getId(), scene);
    }

    public boolean deleteScene(String id) {
        return scenes.remove(id) != null;
    }

    public String getSecurityStatus() {
        return securityStatus;
    }

    public void setSecurityStatus(String securityStatus) {
        this.securityStatus = securityStatus;
    }

    // --- Automation CRUD operations ---

    public Collection<Automation> getAutomations() {
        return automations.values();
    }

    public Optional<Automation> getAutomation(String id) {
        return Optional.ofNullable(automations.get(id));
    }

    public void addAutomation(Automation automation) {
        automations.put(automation.getId(), automation);
    }

    public void updateAutomation(Automation automation) {
        automations.put(automation.getId(), automation);
    }

    public boolean deleteAutomation(String id) {
        return automations.remove(id) != null;
    }

    // --- Activity Log operations ---

    public List<ActivityLog> getActivityLogs() {
        // Return a copy or unmodifiable view to avoid concurrent modification issues during iteration by callers,
        // but for this simple example, returning the list is fine (it is synchronized).
        // A better approach for a "recent" list is to reverse it or limit it.
        // Let's return a copy to be safe.
        synchronized (activityLogs) {
            return new ArrayList<>(activityLogs);
        }
    }

    public void addActivityLog(ActivityLog log) {
        activityLogs.add(0, log); // Add to the beginning to keep it sorted by newest
        // Optional: Limit size to keep memory usage low
        if (activityLogs.size() > 50) {
            activityLogs.remove(activityLogs.size() - 1);
        }
    }
}


