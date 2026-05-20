package training.iqgateway.service;

import java.util.List;
import training.iqgateway.entities.TmUserMaster;

public interface UserMasterService {
    TmUserMaster getByUsername(String username);
    List<TmUserMaster> getAll();
    void addUser(TmUserMaster userRef);
    void deleteUser(String username);
    void updateRole(String username, TmUserMaster updatedUser);
}
