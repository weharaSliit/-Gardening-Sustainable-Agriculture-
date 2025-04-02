package com.backend.backend.service;

import com.backend.backend.dto.ProfileDTO;
import com.backend.backend.entity.ProfileEntity;
import com.backend.backend.entity.UserEntity;
import com.backend.backend.repository.ProfileRepository;
import com.backend.backend.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public ProfileDTO getProfileByUserId(String userId) {
        ProfileEntity profile = profileRepository.findByUserId(userId).orElse(null);
        if (profile == null) return null;

        return new ProfileDTO(profile.getId(), profile.getImage(), profile.getStatus());
    }

    public ProfileDTO createProfile(String userId, ProfileDTO profileData) {
        UserEntity user = userRepository.findById(userId).orElse(null);
        if (user == null) return null;

        ProfileEntity profile = new ProfileEntity(profileData.getImage(), profileData.getStatus());
        profile.setUser(user);

        ProfileEntity savedProfile = profileRepository.save(profile);

        user.setProfile(savedProfile);
        userRepository.save(user);
        return new ProfileDTO(savedProfile.getId(), savedProfile.getImage(), savedProfile.getStatus());
    }
}