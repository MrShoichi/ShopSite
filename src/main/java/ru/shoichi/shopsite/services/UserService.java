package ru.shoichi.shopsite.services;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.shoichi.shopsite.models.Role;
import ru.shoichi.shopsite.models.User;
import ru.shoichi.shopsite.repositories.UserRepository;

import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService extends DBService<User> implements UserDetailsService {
    @PersistenceContext
    private EntityManager em;

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        super(userRepository);
        this.userRepository = userRepository;
    }

    private PasswordEncoder bCryptPasswordEncoder;

    @Autowired
    @Lazy
    public void setPasswordEncoder(PasswordEncoder passwordEncoder)
    {
        bCryptPasswordEncoder = passwordEncoder;
    }

    @Transactional
    public User findByEmail(String email) {
        return this.userRepository.findByEmail(email);
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return user;
    }

    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Collection<Role> roles)
    {
        return roles.stream().map(r -> new SimpleGrantedAuthority(r.getName())).collect(Collectors.toList());
    }

    @Override
    public boolean create(User obj)
    {
        User userFromDB = userRepository.findByEmail(obj.getEmail());

        if (userFromDB != null) {
            return false;
        }
        obj.setEnabled(true);
        obj.setRole(new Role(2, "user"));
        obj.setPassword(bCryptPasswordEncoder.encode(obj.getPassword()));
        repository.save(obj);
        return true;
    }

    public Optional<User> findById(int Id) {
        return this.userRepository.findById(Id);
    }


    public boolean updateRole(int id, Role role) {
        Optional<User> optional = repository.findById(id);
        if(optional.isPresent()){
            User user = optional.get();
            user.setRole(role);
            repository.save(user);
            return true;
        }

        return false;
    }

    @Override
    public boolean update(User obj, int id) {
        Optional<User> user = repository.findById(id);
        if (user.isPresent())
        {
            if(!user.get().getPassword().equals(obj.getPassword()))
            {
                obj.setPassword(bCryptPasswordEncoder.encode(obj.getPassword()));
            }
            obj.setId(id);
            repository.save(obj);
        }
        return user.isPresent();
    }
}
