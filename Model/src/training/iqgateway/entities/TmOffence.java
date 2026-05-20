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
  @NamedQuery(name = "TmOffence.findAll", query = "select o from TmOffence o")
})
@Table(name = "TM_OFFENCE")
public class TmOffence implements Serializable {
    @Id
    @Column(name="OFFENCE_ID", nullable = false)
    private Long offenceId;
    @Column(name="OFFENCE_TYPE", nullable = false, length = 200)
    private String offenceType;
    @Column(nullable = false)
    private Long penalty;
    @Column(name="VEH_TYPE", nullable = false, length = 50)
    private String vehType;
    @OneToMany(mappedBy = "tmOffence")
    private List<TmOffenceDetails> tmOffenceDetailsList;

    public TmOffence() {
    }

    public TmOffence(Long offenceId, String offenceType, Long penalty,
                     String vehType) {
        this.offenceId = offenceId;
        this.offenceType = offenceType;
        this.penalty = penalty;
        this.vehType = vehType;
    }

    public Long getOffenceId() {
        return offenceId;
    }

    public void setOffenceId(Long offenceId) {
        this.offenceId = offenceId;
    }

    public String getOffenceType() {
        return offenceType;
    }

    public void setOffenceType(String offenceType) {
        this.offenceType = offenceType;
    }

    public Long getPenalty() {
        return penalty;
    }

    public void setPenalty(Long penalty) {
        this.penalty = penalty;
    }

    public String getVehType() {
        return vehType;
    }

    public void setVehType(String vehType) {
        this.vehType = vehType;
    }

    public List<TmOffenceDetails> getTmOffenceDetailsList() {
        return tmOffenceDetailsList;
    }

    public void setTmOffenceDetailsList(List<TmOffenceDetails> tmOffenceDetailsList) {
        this.tmOffenceDetailsList = tmOffenceDetailsList;
    }

    public TmOffenceDetails addTmOffenceDetails(TmOffenceDetails tmOffenceDetails) {
        getTmOffenceDetailsList().add(tmOffenceDetails);
        tmOffenceDetails.setTmOffence(this);
        return tmOffenceDetails;
    }

    public TmOffenceDetails removeTmOffenceDetails(TmOffenceDetails tmOffenceDetails) {
        getTmOffenceDetailsList().remove(tmOffenceDetails);
        tmOffenceDetails.setTmOffence(null);
        return tmOffenceDetails;
    }
}
