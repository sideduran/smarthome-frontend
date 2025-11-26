package com.smarthome.patterns.commands;

/**
 * Command pattern example.
 *
 * Each concrete command encapsulates a smart home action and exposes a single
 * {@link #execute()} method.
 */
public interface SmartHomeCommand {

    /**
     * Execute the command.
     */
    void execute();
}


