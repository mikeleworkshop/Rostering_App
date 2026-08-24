package com.rosteroptimizer.service.interfaces;

import com.rosteroptimizer.model.entity.Shift;
import com.rosteroptimizer.model.entity.ShiftTemplate;

public interface IShiftService {
    void createShiftTemplate(ShiftTemplate template);
    void createShiftForWeek(Shift shift);
}
