package training.iqgateway.entities;

import java.io.Serializable;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@NamedQueries({
  @NamedQuery(name = "TmUsermaster.findAll", query = "select o from TmUsermaster o")
})
@Table(name = "TM_USERMASTER")
public class TmUsermaster implements Serializable {
    @Column(nullable = false, length = 20)
    private String password;
    @Id
    @Column(nullable = false, length = 20)
    private String username;
    @ManyToOne
    @JoinColumn(name = "ROLENAME")
    private TmRolemaster tmRolemaster;
    @OneToMany(mappedBy = "tmUsermaster")
    private List<TmOffenceDetails> tmOffenceDetailsList;

    public TmUsermaster() {
    }

    public TmUsermaster(String password, TmRolemaster tmRolemaster, String username) {
        this.password = password;
        this.tmRolemaster = tmRolemaster;
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public TmRolemaster getTmRolemaster() {
        return tmRolemaster;
    }

    public void setTmRolemaster(TmRolemaster tmRolemaster) {
        this.tmRolemaster = tmRolemaster;
    }

    public List<TmOffenceDetails> getTmOffenceDetailsList() {
        return tmOffenceDetailsList;
    }

    public void setTmOffenceDetailsList(List<TmOffenceDetails> tmOffenceDetailsList) {
        this.tmOffenceDetailsList = tmOffenceDetailsList;
    }

    public TmOffenceDetails addTmOffenceDetails(TmOffenceDetails tmOffenceDetails) {
        getTmOffenceDetailsList().add(tmOffenceDetails);
        tmOffenceDetails.setTmUsermaster(this);
        return tmOffenceDetails;
    }

    public TmOffenceDetails removeTmOffenceDetails(TmOffenceDetails tmOffenceDetails) {
        getTmOffenceDetailsList().remove(tmOffenceDetails);
        tmOffenceDetails.setTmUsermaster(null);
        return tmOffenceDetails;
    }
}
