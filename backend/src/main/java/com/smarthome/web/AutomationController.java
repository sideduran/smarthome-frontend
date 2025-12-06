package com.smarthome.web;

import com.smarthome.domain.Automation;
import com.smarthome.patterns.mediator.SmartHomeMediator;
import com.smarthome.web.dto.CreateAutomationRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Optional;

@RestController
@RequestMapping("/api/automations")
@CrossOrigin(origins = "*")
public class AutomationController {

    private final SmartHomeMediator mediator = new SmartHomeMediator();

    @GetMapping
    public Collection<Automation> listAutomations() {
        return mediator.listAutomations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Automation> getAutomation(@PathVariable("id") String id) {
        Optional<Automation> automation = mediator.getAutomation(id);
        return automation.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Automation> createAutomation(@RequestBody CreateAutomationRequest request) {
        Automation automation = new Automation(
                request.getId(),
                request.getName(),
                request.getTime(),
                request.getDays(),
                request.getActions(),
                request.isActive()
        );
        mediator.createAutomation(automation);
        return ResponseEntity.status(HttpStatus.CREATED).body(automation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Automation> updateAutomation(@PathVariable("id") String id, @RequestBody CreateAutomationRequest request) {
        Optional<Automation> existing = mediator.getAutomation(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Automation automation = existing.get();
        automation.setName(request.getName());
        automation.setTime(request.getTime());
        automation.setDays(request.getDays());
        automation.setActions(request.getActions());
        automation.setActive(request.isActive());
        
        mediator.updateAutomation(automation);
        return ResponseEntity.ok(automation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAutomation(@PathVariable("id") String id) {
        boolean deleted = mediator.deleteAutomation(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

