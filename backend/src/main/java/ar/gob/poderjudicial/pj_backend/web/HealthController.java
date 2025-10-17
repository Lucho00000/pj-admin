package ar.gob.poderjudicial.pjbackend.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

  @GetMapping("/api/health")
  public String ok() {
    return "OK";
  }
}
