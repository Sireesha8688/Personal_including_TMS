package training.iqgateway.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "TM_OFFENCE")
public class TmOffence {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "offence_seq")
    @SequenceGenerator(name = "offence_seq", sequenceName = "TM_OFFENCE_ID_SEQ", allocationSize = 1)
    @Column(name = "OFFENCE_ID")
    private Long offenceId;

    @Column(name = "OFFENCE_TYPE", nullable = false)
    private String offenceType;

    @Column(name = "PENALTY", nullable = false)
    private Integer penalty;

    @Column(name = "VEH_TYPE", nullable = false)
    private String vehType;

    public TmOffence() {}

    public TmOffence(Long offenceId, String offenceType, Integer penalty, String vehType) {
        this.offenceId = offenceId;
        this.offenceType = offenceType;
        this.penalty = penalty;
        this.vehType = vehType;
    }

    public Long getOffenceId() { return offenceId; }
    public void setOffenceId(Long offenceId) { this.offenceId = offenceId; }
    public String getOffenceType() { return offenceType; }
    public void setOffenceType(String offenceType) { this.offenceType = offenceType; }
    public Integer getPenalty() { return penalty; }
    public void setPenalty(Integer penalty) { this.penalty = penalty; }
    public String getVehType() { return vehType; }
    public void setVehType(String vehType) { this.vehType = vehType; }

    @Override
    public String toString() {
        return "TmOffence [offenceId=" + offenceId + ", offenceType=" + offenceType +
                ", penalty=" + penalty + ", vehType=" + vehType + "]";
    }
}
