package com.tabibiMicroserviceInscription.tabibiMicroserviceInscription.services;

import com.tabibiMicroserviceInscription.tabibiMicroserviceInscription.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

   @Autowired
    private UserRepo userRepository;

    @Override
    public User findByUsername(String email) {
        return userRepository.findByUsername(email);
    }
    @Override
    public void save(User user) {
        userRepository.save(user);
    }
}
