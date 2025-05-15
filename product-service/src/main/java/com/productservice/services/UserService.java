package com.productservice.services;

import com.productservice.models.UserModel;

import java.util.List;

public interface UserService {
    public UserModel register(UserModel user);

    public UserModel login(String email, String password);

    public List<UserModel> listAll();
}
