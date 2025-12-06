package com.smarthome.patterns.commands;

import com.smarthome.config.InMemoryStateStore;

public class DeleteAutomationCommand implements SmartHomeCommand {
    private final String automationId;
    private final InMemoryStateStore store = InMemoryStateStore.getInstance();

    public DeleteAutomationCommand(String automationId) {
        this.automationId = automationId;
    }

    @Override
    public void execute() {
        store.deleteAutomation(automationId);
    }
}

