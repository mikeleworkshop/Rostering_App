package com.smartrostering.model.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ShareableLink {
    private String token; // [PK]
    private String businessRegNumber; // [FK]
    private LocalDate weekStartDate;
    private LocalDateTime expiryDate;
}
