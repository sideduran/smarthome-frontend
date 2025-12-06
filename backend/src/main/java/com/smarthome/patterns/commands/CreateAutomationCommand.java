package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;
import com.smarthome.domain.Automation;

public class CreateAutomationCommand implements SmartHomeCommand {
    private final Automation automation;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public CreateAutomationCommand(Automation automation) {
        this.automation = automation;
    }

    @Override
    public void execute() {
        store.addAutomation(automation);
    }
}

