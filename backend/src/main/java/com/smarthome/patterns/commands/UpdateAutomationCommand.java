package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.Automation;

public class UpdateAutomationCommand implements SmartHomeCommand {
    private final Automation automation;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public UpdateAutomationCommand(Automation automation) {
        this.automation = automation;
    }

    @Override
    public void execute() {
        if (store.getAutomation(automation.getId()).isPresent()) {
            store.updateAutomation(automation);
        }
    }
}

