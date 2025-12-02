package com.smarthome.web;

import com.smarthome.domain.Device;
import com.smarthome.patterns.mediator.SmartHomeMediator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Optional;

/**
 * Controller for generic Device operations.
 * Exposes /api/devices endpoint.
 */
@RestController
@RequestMapping("/api/devices")
@CrossOrigin(origins = "*")
public class DeviceController {

    private final SmartHomeMediator mediator = new SmartHomeMediator();

    @GetMapping
    public Collection<Device> listDevices() {
        return mediator.listDevices();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Device> getDevice(@PathVariable("id") String id) {
        Optional<Device> device = mediator.getDevice(id);
        return device.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
}

