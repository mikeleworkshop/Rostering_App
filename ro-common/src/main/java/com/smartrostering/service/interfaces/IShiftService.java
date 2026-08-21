package com.smartrostering.service.interfaces;

import com.smartrostering.model.entity.Shift;
import com.smartrostering.model.entity.ShiftTemplate;

public interface IShiftService {
    void createShiftTemplate(ShiftTemplate template);
    void createShiftForWeek(Shift shift);
}
