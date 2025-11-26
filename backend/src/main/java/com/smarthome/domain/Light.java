package com.smarthome.domain;

/**
 * Light device entity.
 * 
 * Inherits from Device (inheritance pattern).
 * Adds light-specific properties like brightness level.
 */
public class Light extends Device {
    private int brightness; // Brightness level from 0 to 100

    public Light() {
        super();
        this.setType("light");
    }

    public Light(String id, String name, boolean online) {
        super(id, name, "light", online);
        this.brightness = 50;
    }

    public Light(String id, String name, boolean online, String roomId) {
        super(id, name, "light", online, roomId);
        this.brightness = 50;
    }

    public int getBrightness() {
        return brightness;
    }

    public void setBrightness(int brightness) {
        // Clamp brightness between 0 and 100
        this.brightness = Math.max(0, Math.min(100, brightness));
    }
}

