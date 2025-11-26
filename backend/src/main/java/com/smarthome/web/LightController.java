package com.smarthome.web;

import com.smarthome.domain.Light;
import com.smarthome.patterns.mediator.SmartHomeMediator;
import com.smarthome.web.dto.CreateLightRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller for Light device-specific operations.
 * 
 * Using Mediator pattern: controller delegates to {@link SmartHomeMediator}
 * instead of calling services or the store directly.
 */
@RestController
@RequestMapping("/api/lights")
@CrossOrigin(origins = "*") // Allow frontend to call this API; adjust in production
public class LightController {

    private final SmartHomeMediator mediator = new SmartHomeMediator();

    // --- CRUD Operations ---

    @GetMapping
    public List<Light> listLights() {
        return mediator.listLights();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Light> getLight(@PathVariable("id") String id) {
        Optional<Light> light = mediator.getLight(id);
        return light.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Light> createLight(@RequestBody CreateLightRequest request) {
        Light light = createLightFromRequest(request);
        mediator.createDevice(light);
        return ResponseEntity.status(HttpStatus.CREATED).body(light);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Light> updateLight(@PathVariable("id") String id, @RequestBody CreateLightRequest request) {
        Optional<Light> existing = mediator.getLight(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Light light = createLightFromRequest(request);
        light.setId(id); // Ensure ID matches path
        mediator.updateDevice(light);
        return ResponseEntity.ok(light);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLight(@PathVariable("id") String id) {
        boolean deleted = mediator.deleteDevice(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // --- Light-specific Operations ---

    @PostMapping("/{id}/turn-on")
    public ResponseEntity<Void> turnOn(@PathVariable("id") String id) {
        mediator.turnOnLight(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/turn-off")
    public ResponseEntity<Void> turnOff(@PathVariable("id") String id) {
        mediator.turnOffLight(id);
        return ResponseEntity.noContent().build();
    }

    // --- Helper method ---

    private Light createLightFromRequest(CreateLightRequest request) {
        Light light = new Light(request.getId(), request.getName(), request.isOnline(), request.getRoomId());
        if (request.getBrightness() != null) {
            light.setBrightness(request.getBrightness());
        }
        return light;
    }
}

