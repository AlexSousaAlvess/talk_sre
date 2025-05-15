package com.productservice.services.impl;

import com.productservice.models.UserModel;
import com.productservice.repositories.ProductRepository;
import com.productservice.repositories.UserRepository;
import com.productservice.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public UserModel register(UserModel user) {
        return userRepository.save(user);
    }

    @Override
    public UserModel login(String email, String password) {
        return userRepository.findByEmail(email).
                filter(u->u.getPassword().
                        equals(password)).
                orElseThrow(()->new RuntimeException("Credenciais inválidas"));
    }

    @Override
    public List<UserModel> listAll() {
        return userRepository.findAll();
    }
}
