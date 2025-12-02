package com.smarthome.web;

import com.smarthome.domain.Scene;
import com.smarthome.patterns.mediator.SmartHomeMediator;
import com.smarthome.web.dto.CreateSceneRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Optional;

@RestController
@RequestMapping("/api/scenes")
@CrossOrigin(origins = "*")
public class SceneController {

    private final SmartHomeMediator mediator = new SmartHomeMediator();

    @GetMapping
    public Collection<Scene> listScenes() {
        return mediator.listScenes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Scene> getScene(@PathVariable("id") String id) {
        Optional<Scene> scene = mediator.getScene(id);
        return scene.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Scene> createScene(@RequestBody CreateSceneRequest request) {
        Scene scene = new Scene(request.getId(), request.getName(), request.getDeviceIds());
        mediator.createScene(scene);
        return ResponseEntity.status(HttpStatus.CREATED).body(scene);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Scene> updateScene(@PathVariable("id") String id, @RequestBody CreateSceneRequest request) {
        Optional<Scene> existing = mediator.getScene(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Scene scene = existing.get();
        scene.setName(request.getName());
        scene.setDeviceIds(request.getDeviceIds());
        mediator.updateScene(scene);
        return ResponseEntity.ok(scene);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScene(@PathVariable("id") String id) {
        boolean deleted = mediator.deleteScene(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<Void> activateScene(@PathVariable("id") String id) {
        mediator.activateScene(id);
        return ResponseEntity.noContent().build();
    }
}

