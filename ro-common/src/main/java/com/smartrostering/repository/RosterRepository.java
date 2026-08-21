package com.smartrostering.repository;

import java.time.LocalDate;

import com.smartrostering.model.entity.Roster;

public interface RosterRepository {
    Roster find(String businessRegNumber, LocalDate weekStart);
    void save(Roster roster);
}
