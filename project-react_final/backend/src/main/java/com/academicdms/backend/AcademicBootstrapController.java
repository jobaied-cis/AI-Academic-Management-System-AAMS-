package com.academicdms.backend;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AcademicBootstrapController {

    private final AcademicDataStore dataStore;

    public AcademicBootstrapController(AcademicDataStore dataStore) {
        this.dataStore = dataStore;
    }

    @GetMapping("/bootstrap")
    public Map<String, Object> bootstrap() {
        return dataStore.bootstrap();
    }
}
