package ar.gob.poderjudicial.pjbackend.mapper;

import ar.gob.poderjudicial.pjbackend.dto.BuildingDto;
import ar.gob.poderjudicial.pjbackend.model.Building;

public class BuildingMapper {
  public static BuildingDto toDto(Building b) {
    return new BuildingDto(b.getId(), b.getName(), b.getStreet(), b.getNumber(), b.getFloor());
  }
  public static void updateEntity(Building b, BuildingDto dto) {
    b.setName(dto.name());
    b.setStreet(dto.street());
    b.setNumber(dto.number());
    b.setFloor(dto.floor());
  }
}
