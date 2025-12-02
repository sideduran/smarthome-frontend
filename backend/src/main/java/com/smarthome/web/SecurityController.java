package com.smarthome.web;

import com.smarthome.patterns.mediator.SmartHomeMediator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller for Security System operations.
 */
@RestController
@RequestMapping("/api/security")
@CrossOrigin(origins = "*")
public class SecurityController {

    private final SmartHomeMediator mediator = new SmartHomeMediator();

    @GetMapping("/status")
    public ResponseEntity<Map<String, String>> getStatus() {
        return ResponseEntity.ok(Map.of("status", mediator.getSecurityStatus()));
    }

    @PostMapping("/arm")
    public ResponseEntity<Map<String, String>> arm() {
        mediator.armSecuritySystem();
        return ResponseEntity.ok(Map.of("status", mediator.getSecurityStatus()));
    }

    @PostMapping("/disarm")
    public ResponseEntity<Map<String, String>> disarm() {
        mediator.disarmSecuritySystem();
        return ResponseEntity.ok(Map.of("status", mediator.getSecurityStatus()));
    }
}

