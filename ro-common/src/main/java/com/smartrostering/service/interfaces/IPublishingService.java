package com.smartrostering.service.interfaces;

import java.time.LocalDate;

public interface IPublishingService {
    void publishRoster(String businessRegNumber, LocalDate weekStart);
    String generateShareableLink(String businessRegNumber, LocalDate weekStart);

}
