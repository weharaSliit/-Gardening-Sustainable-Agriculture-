package com.backend.backend.service;

import com.backend.backend.entity.UserEntity;
import com.backend.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class MyUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    public MyUserDetailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity userData = userRepository.findByUsername(username).orElse(null);

        if(userData == null) throw new UsernameNotFoundException("user not found");

        UserDetails user = User.builder()
                .username(userData.getUsername())
                .password(userData.getPassword())
                .build();
        return user;
    }
}
