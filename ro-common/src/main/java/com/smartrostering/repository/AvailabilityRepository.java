package com.smartrostering.repository;

import java.time.LocalDate;
import java.util.List;

import com.smartrostering.model.entity.Availability;

public interface AvailabilityRepository {
    Availability find(String employeeEmail, LocalDate date, String shiftCode);
    List<Availability> findAllForEmployeeWeek(String employeeEmail, LocalDate weekStart);
    void save(Availability availability);
}
