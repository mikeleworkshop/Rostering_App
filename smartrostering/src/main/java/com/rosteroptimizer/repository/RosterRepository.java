package com.rosteroptimizer.repository;

import java.time.LocalDate;

import com.rosteroptimizer.model.entity.Roster;

public interface RosterRepository {
    Roster find(String businessRegNumber, LocalDate weekStart);
    void save(Roster roster);
}
