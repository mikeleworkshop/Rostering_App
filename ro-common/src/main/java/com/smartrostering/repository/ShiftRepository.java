package com.smartrostering.repository;

import java.time.LocalDate;
import java.util.List;

import com.smartrostering.model.entity.Shift;

public interface ShiftRepository {
    Shift findByCode(String shiftCode);
    List<Shift> findShiftsForWeek(String businessRegNumber, LocalDate weekStart);
    void save(Shift shift);
}
