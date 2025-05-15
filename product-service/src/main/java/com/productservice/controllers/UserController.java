package com.productservice.controllers;

import com.productservice.controllers.dto.LoginDTO;
import com.productservice.models.UserModel;
import com.productservice.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("users")
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserModel> register(@RequestBody UserModel user){
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<UserModel> login(@RequestBody LoginDTO loginDTO){
        UserModel user = userService.login(loginDTO.getEmail(), loginDTO.getPassword());
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @GetMapping
    public ResponseEntity<List<UserModel>> listAll(){
        return ResponseEntity.status(HttpStatus.OK).body(userService.listAll());
    }
}
