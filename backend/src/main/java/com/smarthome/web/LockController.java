package com.smarthome.web;

import com.smarthome.domain.Lock;
import com.smarthome.patterns.mediator.SmartHomeMediator;
import com.smarthome.web.dto.CreateLockRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller for Lock device-specific operations.
 * 
 * Using Mediator pattern: controller delegates to {@link SmartHomeMediator}
 * instead of calling services or the store directly.
 */
@RestController
@RequestMapping("/api/locks")
@CrossOrigin(origins = "*") // Allow frontend to call this API; adjust in production
public class LockController {

    private final SmartHomeMediator mediator = new SmartHomeMediator();

    // --- CRUD Operations ---

    @GetMapping
    public List<Lock> listLocks() {
        return mediator.listLocks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lock> getLock(@PathVariable("id") String id) {
        Optional<Lock> lock = mediator.getLock(id);
        return lock.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Lock> createLock(@RequestBody CreateLockRequest request) {
        Lock lock = new Lock(request.getId(), request.getName(), true);
        applyRequest(lock, request);
        mediator.createDevice(lock);
        return ResponseEntity.status(HttpStatus.CREATED).body(lock);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lock> updateLock(@PathVariable("id") String id, @RequestBody CreateLockRequest request) {
        Optional<Lock> existing = mediator.getLock(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Lock lock = existing.get();
        lock.setName(request.getName());
        applyRequest(lock, request);
        mediator.updateDevice(lock);
        return ResponseEntity.ok(lock);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLock(@PathVariable("id") String id) {
        boolean deleted = mediator.deleteDevice(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // --- Lock-specific Operations ---

    @PostMapping("/{id}/lock")
    public ResponseEntity<Void> lock(@PathVariable("id") String id) {
        mediator.lock(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/unlock")
    public ResponseEntity<Void> unlock(@PathVariable("id") String id) {
        mediator.unlock(id);
        return ResponseEntity.noContent().build();
    }

    // --- Helper method ---

    private void applyRequest(Lock lock, CreateLockRequest request) {
        if (request.getLocked() != null) {
            lock.setLocked(request.getLocked());
        }
    }
}

