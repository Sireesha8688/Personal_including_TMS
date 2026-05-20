package training.iqgateway.service;

import java.util.List;

import training.iqgateway.entities.TmRoleMaster;

public interface RoleMasterService {

	public List<TmRoleMaster> getAllRoles();
	public void addRole(TmRoleMaster roleRef);
	TmRoleMaster getByRolename(String rolename);
	public void deleteRole(String rolename);
	void updateRole(TmRoleMaster updatedRole);
}
