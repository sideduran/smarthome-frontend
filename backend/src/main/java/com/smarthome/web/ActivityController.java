package com.smarthome.web;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.ActivityLog;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "*")
public class ActivityController {

    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    @GetMapping
    public List<ActivityLog> getActivities() {
        return store.getActivityLogs();
    }
}

