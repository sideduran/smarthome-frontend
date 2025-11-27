package com.smarthome.web;

import com.smarthome.domain.Camera;
import com.smarthome.patterns.mediator.SmartHomeMediator;
import com.smarthome.web.dto.CreateCameraRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller for Camera device-specific operations.
 * 
 * Using Mediator pattern: controller delegates to {@link SmartHomeMediator}
 * instead of calling services or the store directly.
 */
@RestController
@RequestMapping("/api/cameras")
@CrossOrigin(origins = "*") // Allow frontend to call this API; adjust in production
public class CameraController {

    private final SmartHomeMediator mediator = new SmartHomeMediator();

    // --- CRUD Operations ---

    @GetMapping
    public List<Camera> listCameras() {
        return mediator.listCameras();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Camera> getCamera(@PathVariable("id") String id) {
        Optional<Camera> camera = mediator.getCamera(id);
        return camera.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Camera> createCamera(@RequestBody CreateCameraRequest request) {
        Camera camera = new Camera(request.getId(), request.getName(), true);
        applyRequest(camera, request);
        mediator.createDevice(camera);
        return ResponseEntity.status(HttpStatus.CREATED).body(camera);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Camera> updateCamera(@PathVariable("id") String id, @RequestBody CreateCameraRequest request) {
        Optional<Camera> existing = mediator.getCamera(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Camera camera = existing.get();
        camera.setName(request.getName());
        applyRequest(camera, request);
        mediator.updateDevice(camera);
        return ResponseEntity.ok(camera);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCamera(@PathVariable("id") String id) {
        boolean deleted = mediator.deleteDevice(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // --- Camera-specific Operations ---

    @PostMapping("/{id}/start-recording")
    public ResponseEntity<Void> startRecording(@PathVariable("id") String id) {
        mediator.startRecording(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/stop-recording")
    public ResponseEntity<Void> stopRecording(@PathVariable("id") String id) {
        mediator.stopRecording(id);
        return ResponseEntity.noContent().build();
    }

    // --- Helper method ---

    private void applyRequest(Camera camera, CreateCameraRequest request) {
        if (request.getRecording() != null) {
            camera.setRecording(request.getRecording());
        }
    }
}

