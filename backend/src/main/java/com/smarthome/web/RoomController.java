package com.smarthome.web;

import com.smarthome.domain.Room;
import com.smarthome.patterns.mediator.SmartHomeMediator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Optional;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*") // Allow frontend to call this API; adjust in production
public class RoomController {

    /**
     * Using Mediator pattern: controller delegates to {@link SmartHomeMediator}
     * instead of calling services or the store directly.
     */
    private final SmartHomeMediator mediator = new SmartHomeMediator();

    // --- CRUD Operations ---

    @GetMapping
    public Collection<Room> listRooms() {
        return mediator.listRooms();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoom(@PathVariable("id") String id) {
        Optional<Room> room = mediator.getRoom(id);
        return room.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        mediator.createRoom(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(room);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable("id") String id, @RequestBody Room room) {
        Optional<Room> existing = mediator.getRoom(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        room.setId(id); // Ensure ID matches path
        mediator.updateRoom(room);
        return ResponseEntity.ok(room);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable("id") String id) {
        boolean deleted = mediator.deleteRoom(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

