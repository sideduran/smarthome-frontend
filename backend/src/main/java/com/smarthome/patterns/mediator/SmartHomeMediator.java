package com.smarthome.patterns.mediator;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.*;
import com.smarthome.patterns.commands.*;
import com.smarthome.patterns.commands.ActivateSceneCommand;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Mediator pattern example.
 *
 * This class coordinates interactions between various parts of the smart home
 * domain (devices, scenes, automations, rooms). Controllers and services talk to
 * the mediator instead of talking to each other directly.
 * 
 * All CRUD operations use the Command pattern internally.
 */
public class SmartHomeMediator {

    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    // --- Device CRUD operations ---

    public Collection<Device> listDevices() {
        return store.getDevices();
    }

    public Optional<Device> getDevice(String deviceId) {
        return store.getDevice(deviceId);
    }

    public void createDevice(Device device) {
        SmartHomeCommand command = new CreateDeviceCommand(device);
        command.execute();
    }

    public void updateDevice(Device device) {
        SmartHomeCommand command = new UpdateDeviceCommand(device);
        command.execute();
    }

    public boolean deleteDevice(String deviceId) {
        if (store.getDevice(deviceId).isPresent()) {
            SmartHomeCommand command = new DeleteDeviceCommand(deviceId);
            command.execute();
            return true;
        }
        return false;
    }

    public void toggleDevice(String deviceId) {
        SmartHomeCommand command = new ToggleDeviceCommand(deviceId);
        command.execute();
    }

    public void turnOnLight(String deviceId) {
        SmartHomeCommand command = new TurnOnLightCommand(deviceId);
        command.execute();
    }

    public void turnOffLight(String deviceId) {
        SmartHomeCommand command = new TurnOffLightCommand(deviceId);
        command.execute();
    }

    public void increaseTargetHeat(String deviceId) {
        SmartHomeCommand command = new IncreaseTargetHeatCommand(deviceId);
        command.execute();
    }

    public void increaseTargetHeat(String deviceId, double amount) {
        SmartHomeCommand command = new IncreaseTargetHeatCommand(deviceId, amount);
        command.execute();
    }

    public void decreaseTargetHeat(String deviceId) {
        SmartHomeCommand command = new DecreaseTargetHeatCommand(deviceId);
        command.execute();
    }

    public void decreaseTargetHeat(String deviceId, double amount) {
        SmartHomeCommand command = new DecreaseTargetHeatCommand(deviceId, amount);
        command.execute();
    }

    public void setTargetHeat(String deviceId, double targetTemperature) {
        SmartHomeCommand command = new SetTargetHeatCommand(deviceId, targetTemperature);
        command.execute();
    }

    public void lock(String deviceId) {
        SmartHomeCommand command = new LockCommand(deviceId);
        command.execute();
    }

    public void unlock(String deviceId) {
        SmartHomeCommand command = new UnlockCommand(deviceId);
        command.execute();
        checkAndDisarmIfAllSafe();
    }

    private void checkAndDisarmIfAllSafe() {
        boolean anyLocked = listLocks().stream().anyMatch(Lock::isLocked);
        boolean anyRecording = listCameras().stream().anyMatch(Camera::isRecording);

        if (!anyLocked && !anyRecording) {
            disarmSecuritySystem();
        }
    }

    // --- Device type-specific query operations ---

    public List<Light> listLights() {
        return store.getDevices().stream()
                .filter(device -> device instanceof Light)
                .map(device -> (Light) device)
                .collect(Collectors.toList());
    }

    public Optional<Light> getLight(String deviceId) {
        return store.getDevice(deviceId)
                .filter(device -> device instanceof Light)
                .map(device -> (Light) device);
    }

    public List<Lock> listLocks() {
        return store.getDevices().stream()
                .filter(device -> device instanceof Lock)
                .map(device -> (Lock) device)
                .collect(Collectors.toList());
    }

    public Optional<Lock> getLock(String deviceId) {
        return store.getDevice(deviceId)
                .filter(device -> device instanceof Lock)
                .map(device -> (Lock) device);
    }

    public List<Thermostat> listThermostats() {
        return store.getDevices().stream()
                .filter(device -> device instanceof Thermostat)
                .map(device -> (Thermostat) device)
                .collect(Collectors.toList());
    }

    public Optional<Thermostat> getThermostat(String deviceId) {
        return store.getDevice(deviceId)
                .filter(device -> device instanceof Thermostat)
                .map(device -> (Thermostat) device);
    }

    public List<Camera> listCameras() {
        return store.getDevices().stream()
                .filter(device -> device instanceof Camera)
                .map(device -> (Camera) device)
                .collect(Collectors.toList());
    }

    public Optional<Camera> getCamera(String deviceId) {
        return store.getDevice(deviceId)
                .filter(device -> device instanceof Camera)
                .map(device -> (Camera) device);
    }

    public void startRecording(String deviceId) {
        SmartHomeCommand command = new StartRecordingCommand(deviceId);
        command.execute();
    }

    public void stopRecording(String deviceId) {
        SmartHomeCommand command = new StopRecordingCommand(deviceId);
        command.execute();
        checkAndDisarmIfAllSafe();
    }

    public boolean assignDeviceToRoom(String deviceId, String roomId) {
        Optional<Device> device = store.getDevice(deviceId);
        Optional<Room> room = store.getRoom(roomId);
        if (device.isPresent() && room.isPresent()) {
            SmartHomeCommand command = new AssignDeviceToRoomCommand(deviceId, roomId);
            command.execute();
            return true;
        }
        return false;
    }

    // --- Room CRUD operations ---

    public Collection<Room> listRooms() {
        return store.getRooms();
    }

    public Optional<Room> getRoom(String roomId) {
        return store.getRoom(roomId);
    }

    public void createRoom(Room room) {
        SmartHomeCommand command = new CreateRoomCommand(room);
        command.execute();
    }

    public void updateRoom(Room room) {
        SmartHomeCommand command = new UpdateRoomCommand(room);
        command.execute();
    }

    public boolean deleteRoom(String roomId) {
        if (store.getRoom(roomId).isPresent()) {
            SmartHomeCommand command = new DeleteRoomCommand(roomId);
            command.execute();
            return true;
        }
        return false;
    }

    // --- Scene CRUD operations ---

    public Collection<Scene> listScenes() {
        return store.getScenes();
    }

    public Optional<Scene> getScene(String sceneId) {
        return store.getScene(sceneId);
    }

    public void createScene(Scene scene) {
        SmartHomeCommand command = new CreateSceneCommand(scene);
        command.execute();
    }

    public void updateScene(Scene scene) {
        SmartHomeCommand command = new UpdateSceneCommand(scene);
        command.execute();
    }

    public boolean deleteScene(String sceneId) {
        if (store.getScene(sceneId).isPresent()) {
            SmartHomeCommand command = new DeleteSceneCommand(sceneId);
            command.execute();
            return true;
        }
        return false;
    }

    public void activateScene(String sceneId) {
        SmartHomeCommand command = new ActivateSceneCommand(sceneId);
        command.execute();
    }

    // --- Security System operations ---

    public String getSecurityStatus() {
        return store.getSecurityStatus();
    }

    public void armSecuritySystem() {
        SmartHomeCommand command = new SetSecurityStatusCommand("armed");
        command.execute();
    }

    public void disarmSecuritySystem() {
        SmartHomeCommand command = new SetSecurityStatusCommand("disarmed");
        command.execute();
    }

    // --- Automation CRUD operations ---

    public Collection<Automation> listAutomations() {
        return store.getAutomations();
    }

    public Optional<Automation> getAutomation(String id) {
        return store.getAutomation(id);
    }

    public void createAutomation(Automation automation) {
        SmartHomeCommand command = new CreateAutomationCommand(automation);
        command.execute();
    }

    public void updateAutomation(Automation automation) {
        SmartHomeCommand command = new UpdateAutomationCommand(automation);
        command.execute();
    }

    public boolean deleteAutomation(String id) {
        if (store.getAutomation(id).isPresent()) {
            SmartHomeCommand command = new DeleteAutomationCommand(id);
            command.execute();
            return true;
        }
        return false;
    }
}


