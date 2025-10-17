package ar.gob.poderjudicial.pjbackend.dto;

import java.time.LocalDateTime;

public record MoveRecordDto(
    Long departmentId,
    String departmentName,
    Long buildingId,
    String buildingName,
    LocalDateTime fromTs,
    LocalDateTime toTs
) {}
