package training.iqgateway.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.iqgateway.entities.TmRoleMaster;
import training.iqgateway.repositories.RolemasterRepository;
import training.iqgateway.service.RoleMasterService;

import java.util.List;
import java.util.Optional;

@Service
public class RoleMasterServiceImpl implements RoleMasterService {

    private final RolemasterRepository rolemasterRepository;

    @Autowired
    public RoleMasterServiceImpl(RolemasterRepository rolemasterRepository) {
        this.rolemasterRepository = rolemasterRepository;
    }

    @Override
    public List<TmRoleMaster> getAllRoles() {
        return rolemasterRepository.findAll();
    }

    @Override
    public void addRole(TmRoleMaster roleRef) {
        rolemasterRepository.save(roleRef);
    }

    @Override
    public TmRoleMaster getByRolename(String rolename) {
        Optional<TmRoleMaster> roleOpt = rolemasterRepository.findById(rolename);
        return roleOpt.orElse(null); // Or throw a custom exception if preferred
    }

    @Override
    public void deleteRole(String rolename) {
        rolemasterRepository.deleteById(rolename);
    }

    @Override
    public void updateRole(TmRoleMaster updatedRole) {
        if (rolemasterRepository.existsById(updatedRole.getRolename())) {
            rolemasterRepository.save(updatedRole);
        } else {
            throw new RuntimeException("Role not found with rolename: " + updatedRole.getRolename());
        }
    }

}
