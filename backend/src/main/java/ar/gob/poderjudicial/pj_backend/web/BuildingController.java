package ar.gob.poderjudicial.pjbackend.web;

import ar.gob.poderjudicial.pjbackend.dto.BuildingDto;
import ar.gob.poderjudicial.pjbackend.mapper.BuildingMapper;
import ar.gob.poderjudicial.pjbackend.model.Building;
import ar.gob.poderjudicial.pjbackend.repo.BuildingRepository;
import ar.gob.poderjudicial.pjbackend.repo.DepartmentRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;

import static ar.gob.poderjudicial.pjbackend.mapper.BuildingMapper.toDto;

@RestController
@RequestMapping("/api/buildings")
public class BuildingController {
  private final BuildingRepository repo;
  private final DepartmentRepository depRepo;

  public BuildingController(BuildingRepository repo, DepartmentRepository depRepo) {
    this.repo = repo;
    this.depRepo = depRepo;
  }

  @GetMapping
  public Iterable<BuildingDto> list() {
    return repo.findAll().stream().map(BuildingMapper::toDto).toList();
  }

  @GetMapping("{id}")
  public BuildingDto get(@PathVariable Long id) {
    var b = repo.findById(id).orElseThrow(() -> new NotFoundException("Building " + id + " not found"));
    return toDto(b);
  }

  @PostMapping
  public ResponseEntity<BuildingDto> create(@RequestBody @Valid BuildingDto dto) {
    var b = new Building();
    BuildingMapper.updateEntity(b, dto);
    b = repo.save(b);
    return ResponseEntity.created(URI.create("/api/buildings/" + b.getId())).body(toDto(b));
  }

  @PutMapping("{id}")
  public BuildingDto update(@PathVariable Long id, @RequestBody @Valid BuildingDto dto) {
    var b = repo.findById(id).orElseThrow(() -> new NotFoundException("Building " + id + " not found"));
    BuildingMapper.updateEntity(b, dto);
    return toDto(repo.save(b));
  }

  @DeleteMapping("{id}")
  public void delete(@PathVariable Long id) {
    if (!repo.existsById(id)) {
      throw new NotFoundException("Building " + id + " not found");
    }
    long deps = depRepo.countByBuildingId(id);
    if (deps > 0) {
      throw new ResponseStatusException(
          HttpStatus.CONFLICT,
          "No se puede eliminar el edificio " + id + " porque tiene " + deps + " dependencias asociadas."
      );
    }
    repo.deleteById(id);
  }
}
