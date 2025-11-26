package com.smarthome.domain;

/**
 * Lock device entity.
 * 
 * Inherits from Device (inheritance pattern).
 * Adds lock-specific properties like lock status.
 * Note: For locks, "on" means locked, "off" means unlocked.
 */
public class Lock extends Device {
    private boolean locked; // Explicit lock status (redundant with isOn() but clearer)

    public Lock() {
        super();
        this.setType("lock");
    }

    public Lock(String id, String name, boolean online) {
        super(id, name, "lock", online);
        this.locked = true; // Default to locked for security
        this.setOn(true); // Sync with parent's on state
    }

    public Lock(String id, String name, boolean online, String roomId) {
        super(id, name, "lock", online, roomId);
        this.locked = true;
        this.setOn(true);
    }

    public boolean isLocked() {
        return locked;
    }

    public void setLocked(boolean locked) {
        this.locked = locked;
        this.setOn(locked); // Keep parent's on state in sync
    }

    @Override
    public void setOn(boolean on) {
        super.setOn(on);
        this.locked = on; // Keep lock status in sync with on state
    }
}

