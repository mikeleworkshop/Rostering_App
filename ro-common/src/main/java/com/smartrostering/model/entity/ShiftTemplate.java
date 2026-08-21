package com.smartrostering.model.entity;

import java.time.LocalDateTime;
import java.util.Set;

public class ShiftTemplate {
    private String templateCode; // [PK]
    private String businessRegNumber; // [FK]
    private String name;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Set<String> requiredSkillNames;
	
}
