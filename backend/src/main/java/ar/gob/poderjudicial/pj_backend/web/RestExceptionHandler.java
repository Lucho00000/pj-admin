package ar.gob.poderjudicial.pjbackend.web;

import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import org.springframework.dao.DataIntegrityViolationException;




@RestControllerAdvice
public class RestExceptionHandler {
  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<Map<String,Object>> notFound(NotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
  }
  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<Map<String,Object>> conflict(DataIntegrityViolationException ex) {
  return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Violación de unicidad o integridad de datos"));
  }
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String,Object>> badRequest(MethodArgumentNotValidException ex) {
    var errors = ex.getBindingResult().getFieldErrors().stream()
        .map(fe -> Map.of("field", fe.getField(), "message", fe.getDefaultMessage()))
        .toList();
    return ResponseEntity.badRequest().body(Map.of("errors", errors));
  }
}
