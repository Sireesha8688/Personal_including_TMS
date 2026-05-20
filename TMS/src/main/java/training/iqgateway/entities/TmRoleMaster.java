package training.iqgateway.entities;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "TM_ROLEMASTER")
public class TmRoleMaster implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "ROLENAME", nullable = false, unique = true, length = 50)
    private String rolename;

    @Column(name = "ROLE_DESC", length = 255)
    private String roleDesc;

    @OneToMany(mappedBy = "role")
    @JsonManagedReference
    private List<TmUserMaster> users;

    public TmRoleMaster() {}

    public TmRoleMaster(String rolename, String roleDesc) {
        this.rolename = rolename;
        this.roleDesc = roleDesc;
    }

    public TmRoleMaster(String rolename) {
        this.rolename = rolename;
    }

    public String getRolename() { return rolename; }
    public void setRolename(String rolename) { this.rolename = rolename; }
    public String getRoleDesc() { return roleDesc; }
    public void setRoleDesc(String roleDesc) { this.roleDesc = roleDesc; }
    public List<TmUserMaster> getUsers() { return users; }
    public void setUsers(List<TmUserMaster> users) { this.users = users; }

    @Override
    public String toString() {
        return "TmRoleMaster{" +
                "rolename='" + rolename + '\'' +
                ", roleDesc='" + roleDesc + '\'' +
                '}';
    }
}
