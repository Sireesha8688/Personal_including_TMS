package training.iqgateway.entities;

import java.io.Serializable;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@NamedQueries({
  @NamedQuery(name = "TmRolemaster.findAll", query = "select o from TmRolemaster o")
})
@Table(name = "TM_ROLEMASTER")
public class TmRolemaster implements Serializable {
    @Id
    @Column(nullable = false, length = 20)
    private String rolename;
    @Column(name="ROLE_DESC", length = 100)
    private String roleDesc;
    @OneToMany(mappedBy = "tmRolemaster")
    private List<TmUsermaster> tmUsermasterList;

    public TmRolemaster() {
    }

    public TmRolemaster(String roleDesc, String rolename) {
        this.roleDesc = roleDesc;
        this.rolename = rolename;
    }

    public String getRolename() {
        return rolename;
    }

    public void setRolename(String rolename) {
        this.rolename = rolename;
    }

    public String getRoleDesc() {
        return roleDesc;
    }

    public void setRoleDesc(String roleDesc) {
        this.roleDesc = roleDesc;
    }

    public List<TmUsermaster> getTmUsermasterList() {
        return tmUsermasterList;
    }

    public void setTmUsermasterList(List<TmUsermaster> tmUsermasterList) {
        this.tmUsermasterList = tmUsermasterList;
    }

    public TmUsermaster addTmUsermaster(TmUsermaster tmUsermaster) {
        getTmUsermasterList().add(tmUsermaster);
        tmUsermaster.setTmRolemaster(this);
        return tmUsermaster;
    }

    public TmUsermaster removeTmUsermaster(TmUsermaster tmUsermaster) {
        getTmUsermasterList().remove(tmUsermaster);
        tmUsermaster.setTmRolemaster(null);
        return tmUsermaster;
    }
}
