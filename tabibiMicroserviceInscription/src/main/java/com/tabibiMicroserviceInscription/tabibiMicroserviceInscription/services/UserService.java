package com.tabibiMicroserviceInscription.tabibiMicroserviceInscription.services;

import com.tabibiMicroserviceInscription.tabibiMicroserviceInscription.entities.User;

public interface UserService {
    User findByUsername(String email);

    void save(User user);
}


