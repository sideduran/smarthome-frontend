package com.smarthome.web;

import com.smarthome.domain.Room;
import com.smarthome.patterns.mediator.SmartHomeMediator;
import com.smarthome.web.dto.CreateRoomRequest;
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
    public ResponseEntity<Room> createRoom(@RequestBody CreateRoomRequest request) {
        Room room = new Room(request.getId(), request.getName(), request.getDescription());
        mediator.createRoom(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(room);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable("id") String id, @RequestBody CreateRoomRequest request) {
        Optional<Room> existing = mediator.getRoom(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Room room = existing.get();
        room.setName(request.getName());
        room.setDescription(request.getDescription());
        mediator.updateRoom(room);
        return ResponseEntity.ok(room);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable("id") String id) {
        boolean deleted = mediator.deleteRoom(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/{roomId}/devices/{deviceId}")
    public ResponseEntity<Void> assignDeviceToRoom(@PathVariable("roomId") String roomId,
                                                   @PathVariable("deviceId") String deviceId) {
        boolean assigned = mediator.assignDeviceToRoom(deviceId, roomId);
        return assigned ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

