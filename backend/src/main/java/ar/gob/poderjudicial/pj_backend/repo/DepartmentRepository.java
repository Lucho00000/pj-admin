package ar.gob.poderjudicial.pjbackend.repo;

import ar.gob.poderjudicial.pjbackend.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

  @Query("select count(d) from Department d where d.building.id = :buildingId")
  long countByBuildingId(Long buildingId);
}
