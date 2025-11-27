package com.smarthome.web;

import com.smarthome.domain.Thermostat;
import com.smarthome.patterns.mediator.SmartHomeMediator;
import com.smarthome.web.dto.CreateThermostatRequest;
import com.smarthome.web.dto.SetTargetHeatRequest;
import com.smarthome.web.dto.TemperatureAdjustmentRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller for Thermostat device-specific operations.
 * 
 * Using Mediator pattern: controller delegates to {@link SmartHomeMediator}
 * instead of calling services or the store directly.
 */
@RestController
@RequestMapping("/api/thermostats")
@CrossOrigin(origins = "*") // Allow frontend to call this API; adjust in production
public class ThermostatController {

    private final SmartHomeMediator mediator = new SmartHomeMediator();

    // --- CRUD Operations ---

    @GetMapping
    public List<Thermostat> listThermostats() {
        return mediator.listThermostats();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Thermostat> getThermostat(@PathVariable("id") String id) {
        Optional<Thermostat> thermostat = mediator.getThermostat(id);
        return thermostat.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Thermostat> createThermostat(@RequestBody CreateThermostatRequest request) {
        Thermostat thermostat = createThermostatFromRequest(request);
        mediator.createDevice(thermostat);
        return ResponseEntity.status(HttpStatus.CREATED).body(thermostat);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Thermostat> updateThermostat(@PathVariable("id") String id, @RequestBody CreateThermostatRequest request) {
        Optional<Thermostat> existing = mediator.getThermostat(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Thermostat thermostat = createThermostatFromRequest(request);
        thermostat.setId(id); // Ensure ID matches path
        mediator.updateDevice(thermostat);
        return ResponseEntity.ok(thermostat);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteThermostat(@PathVariable("id") String id) {
        boolean deleted = mediator.deleteDevice(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // --- Thermostat-specific Operations ---

    @PostMapping("/{id}/increase-target-heat")
    public ResponseEntity<Void> increaseTargetHeat(
            @PathVariable("id") String id,
            @RequestBody(required = false) TemperatureAdjustmentRequest request) {
        if (request != null && request.getAmount() != null) {
            mediator.increaseTargetHeat(id, request.getAmount());
        } else {
            mediator.increaseTargetHeat(id); // Default increase by 1°C
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/decrease-target-heat")
    public ResponseEntity<Void> decreaseTargetHeat(
            @PathVariable("id") String id,
            @RequestBody(required = false) TemperatureAdjustmentRequest request) {
        if (request != null && request.getAmount() != null) {
            mediator.decreaseTargetHeat(id, request.getAmount());
        } else {
            mediator.decreaseTargetHeat(id); // Default decrease by 1°C
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/set-target-heat")
    public ResponseEntity<Void> setTargetHeat(
            @PathVariable("id") String id,
            @RequestBody SetTargetHeatRequest request) {
        if (request == null || request.getTargetTemperature() == null) {
            return ResponseEntity.badRequest().build();
        }
        mediator.setTargetHeat(id, request.getTargetTemperature());
        return ResponseEntity.noContent().build();
    }

    // --- Helper method ---

    private Thermostat createThermostatFromRequest(CreateThermostatRequest request) {
        Thermostat thermostat = new Thermostat(request.getId(), request.getName());
        if (request.getCurrentTemperature() != null) {
            thermostat.setCurrentTemperature(request.getCurrentTemperature());
        }
        if (request.getTargetTemperature() != null) {
            thermostat.setTargetTemperature(request.getTargetTemperature());
        }
        return thermostat;
    }
}

