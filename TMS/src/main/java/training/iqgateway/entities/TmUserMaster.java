package training.iqgateway.entities;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "TM_USERMASTER")
public class TmUserMaster {

    @Id
    @Column(name = "USERNAME", length = 50)
    private String username;

    @Column(name = "PASSWORD", nullable = false)
    private String password;

    @ManyToOne
    @JoinColumn(name = "ROLENAME", referencedColumnName = "ROLENAME", nullable = false)
    @JsonBackReference
    private TmRoleMaster role;

    @OneToMany(mappedBy = "reportedBy")
    @JsonManagedReference
    private List<TmOffenceDetails> reportedOffences;

    public TmUserMaster() {}

    public TmUserMaster(String username, String password, TmRoleMaster role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public TmRoleMaster getRole() { return role; }
    public void setRole(TmRoleMaster role) { this.role = role; }
    public List<TmOffenceDetails> getReportedOffences() { return reportedOffences; }
    public void setReportedOffences(List<TmOffenceDetails> reportedOffences) { this.reportedOffences = reportedOffences; }

    @Override
    public String toString() {
        return "TmUserMaster{" +
                "username='" + username + '\'' +
                ", password='[PROTECTED]'" +
                ", role=" + (role != null ? role.getRolename() : null) +
                '}';
    }
}
