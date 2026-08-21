package com.smartrostering.model.entity;

import java.time.LocalDate;

public class Shift {
    private String shiftCode; // [PK]
    private String templateCode; // [FK]
    private LocalDate date;
    private int requiredHeadcount;
	
    public void getStartTime() {}
    public void getEndTime() {}

}
