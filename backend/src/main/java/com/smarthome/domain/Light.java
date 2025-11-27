package com.smarthome.domain;

/**
 * Light device entity.
 * 
 * Inherits from Device (inheritance pattern).
 * Adds light-specific properties like brightness level.
 */
public class Light extends Device {

    public Light() {
        super();
        this.setType("light");
    }

    public Light(String id, String name) {
        super(id, name, "light", true);
    }
}

