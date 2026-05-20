package training.iqgateway.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.iqgateway.entities.TmUserMaster;
import training.iqgateway.repositories.UserMasterRepository;
import training.iqgateway.service.UserMasterService;

import java.util.List;
import java.util.Optional;

@Service
public class UserMasterServiceImpl implements UserMasterService {

    private final UserMasterRepository userMasterRepository;

    @Autowired
    public UserMasterServiceImpl(UserMasterRepository userMasterRepository) {
        this.userMasterRepository = userMasterRepository;
    }

    @Override
    public TmUserMaster getByUsername(String username) {
        Optional<TmUserMaster> userOpt = userMasterRepository.findById(username);
        return userOpt.orElse(null);
    }

    @Override
    public List<TmUserMaster> getAll() {
        return userMasterRepository.findAll();
    }

    @Override
    public void addUser(TmUserMaster userRef) {
        userMasterRepository.save(userRef);
    }

    @Override
    public void deleteUser(String username) {
        userMasterRepository.deleteById(username);
    }

    @Override
    public void updateRole(String username, TmUserMaster updatedUser) {
        if (userMasterRepository.existsById(username)) {
            // Ensure username consistency
            updatedUser.setUsername(username);
            userMasterRepository.save(updatedUser);
        } else {
            throw new RuntimeException("User not found with username: " + username);
        }
    }
}
