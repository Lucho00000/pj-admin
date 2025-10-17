package ar.gob.poderjudicial.pjbackend.web;

import ar.gob.poderjudicial.pjbackend.dto.DepartmentDto;
import ar.gob.poderjudicial.pjbackend.mapper.DepartmentMapper;
import ar.gob.poderjudicial.pjbackend.model.Department;
import ar.gob.poderjudicial.pjbackend.repo.BuildingRepository;
import ar.gob.poderjudicial.pjbackend.repo.DepartmentRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

import static ar.gob.poderjudicial.pjbackend.mapper.DepartmentMapper.toDto;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {
  private final DepartmentRepository repo;
  private final BuildingRepository buildingRepo;

  public DepartmentController(DepartmentRepository repo, BuildingRepository buildingRepo) {
    this.repo = repo;
    this.buildingRepo = buildingRepo;
  }

  @GetMapping
  public Iterable<DepartmentDto> list() {
    return repo.findAll().stream().map(DepartmentMapper::toDto).toList();
  }

  @GetMapping("{id}")
  public DepartmentDto get(@PathVariable Long id) {
    var d = repo.findById(id).orElseThrow(() -> new NotFoundException("Department " + id + " not found"));
    return toDto(d);
  }

  @PostMapping
  public ResponseEntity<DepartmentDto> create(@RequestBody @Valid DepartmentDto dto) {
    var b = buildingRepo.findById(dto.buildingId())
        .orElseThrow(() -> new NotFoundException("Building " + dto.buildingId() + " not found"));
    var d = new Department();
    DepartmentMapper.updateEntity(d, dto);
    d.setBuilding(b);
    d = repo.save(d);
    return ResponseEntity.created(URI.create("/api/departments/" + d.getId())).body(toDto(d));
  }

  @PutMapping("{id}")
  public DepartmentDto update(@PathVariable Long id, @RequestBody @Valid DepartmentDto dto) {
    var d = repo.findById(id).orElseThrow(() -> new NotFoundException("Department " + id + " not found"));
    
    if (dto.buildingId() != null && (d.getBuilding() == null || !dto.buildingId().equals(d.getBuilding().getId()))) {
      var b = buildingRepo.findById(dto.buildingId())
          .orElseThrow(() -> new NotFoundException("Building " + dto.buildingId() + " not found"));
      d.setBuilding(b);
    }
    DepartmentMapper.updateEntity(d, dto);
    return toDto(repo.save(d));
  }

  @DeleteMapping("{id}")
  public void delete(@PathVariable Long id) {
    if (!repo.existsById(id)) throw new NotFoundException("Department " + id + " not found");
    repo.deleteById(id);
  }
}
