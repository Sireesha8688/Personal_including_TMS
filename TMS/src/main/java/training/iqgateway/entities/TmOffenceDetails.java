package training.iqgateway.entities;

import jakarta.persistence.*;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "TM_OFFENCE_DETAILS")
public class TmOffenceDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "offdet_seq")
    @SequenceGenerator(name = "offdet_seq", sequenceName = "TM_OFFENCE_DETAIL_ID_SEQ", allocationSize = 1)
    @Column(name = "OFFENCE_DETAIL_ID")
    private Long offenceDetailId;

    @Column(name = "VEH_NO", nullable = false)
    private String vehNo;

    @Lob
    @Column(name = "IMAGE")
    private byte[] image;

    @Column(name = "OFFENCE_STATUS")
    private String offenceStatus;

    @ManyToOne
    @JoinColumn(name = "OFFENCE_ID", nullable = false)
    private TmOffence offence;

    @Column(name = "TIME", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date time;

    @Column(name = "PLACE", nullable = false)
    private String place;

    @ManyToOne
    @JoinColumn(name = "REPORTED_BY", referencedColumnName = "USERNAME", nullable = false)
    @JsonBackReference
    private TmUserMaster reportedBy;

    public TmOffenceDetails() {}

    // Constructor for insert (using entity references)
    public TmOffenceDetails(String vehNo, byte[] image, String offenceStatus,
                            TmOffence offence, Date time, String place, TmUserMaster reportedBy) {
        this.vehNo = vehNo;
        this.image = image;
        this.offenceStatus = offenceStatus;
        this.offence = offence;
        this.time = time;
        this.place = place;
        this.reportedBy = reportedBy;
    }

    public Long getOffenceDetailId() { return offenceDetailId; }
    public void setOffenceDetailId(Long offenceDetailId) { this.offenceDetailId = offenceDetailId; }

    public String getVehNo() { return vehNo; }
    public void setVehNo(String vehNo) { this.vehNo = vehNo; }

    public byte[] getImage() { return image; }
    public void setImage(byte[] image) { this.image = image; }

    public String getOffenceStatus() { return offenceStatus; }
    public void setOffenceStatus(String offenceStatus) { this.offenceStatus = offenceStatus; }

    public TmOffence getOffence() { return offence; }
    public void setOffence(TmOffence offence) { this.offence = offence; }

    public Date getTime() { return time; }
    public void setTime(Date time) { this.time = time; }

    public String getPlace() { return place; }
    public void setPlace(String place) { this.place = place; }

    public TmUserMaster getReportedBy() { return reportedBy; }
    public void setReportedBy(TmUserMaster reportedBy) { this.reportedBy = reportedBy; }

    @Override
    public String toString() {
        return "TmOffenceDetails [offenceDetailId=" + offenceDetailId +
                ", vehNo=" + vehNo +
                ", offenceStatus=" + offenceStatus +
                ", offence=" + (offence != null ? offence.getOffenceId() : null) +
                ", time=" + time +
                ", place=" + place +
                ", reportedBy=" + (reportedBy != null ? reportedBy.getUsername() : null) +
                ", image=" + (image != null ? "[BLOB]" : "null") + "]";
    }
}
