package com.tabibiMicroserviceInscription.tabibiMicroserviceInscription.services;

import com.tabibiMicroserviceInscription.tabibiMicroserviceInscription.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Long> {
    User findByUsername(String username);
}

