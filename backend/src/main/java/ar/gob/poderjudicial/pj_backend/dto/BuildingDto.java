package ar.gob.poderjudicial.pjbackend.dto;

import jakarta.validation.constraints.NotBlank;

public record BuildingDto(
    Long id,
    @NotBlank String name,
    @NotBlank String street,
    @NotBlank String number,
    String floor
) {}
