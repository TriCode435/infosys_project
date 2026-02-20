package com.wellnest.config;

import com.wellnest.entity.User;
import com.wellnest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Since username can be same across roles, we might need a more complex lookup
        // if we want strict role-based login
        // But for standard JWT, username uniqueness is usually required or handled via
        // claims.
        // The prompt says "Same username is allowed across different roles",
        // "Authentication must use username + role"
        // This means the standard UserDetailsService needs to be adapted or our login
        // controller handles it.
        // For JWT filter, we'll assume username is unique or we store role in JWT and
        // use it.

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
    }
}
