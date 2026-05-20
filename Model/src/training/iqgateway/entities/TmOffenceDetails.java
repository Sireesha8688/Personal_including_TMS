package training.iqgateway.entities;

import java.io.Serializable;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@NamedQueries({
  @NamedQuery(name = "TmOffenceDetails.findAll", query = "select o from TmOffenceDetails o")
})
@Table(name = "TM_OFFENCE_DETAILS")
public class TmOffenceDetails implements Serializable {
    private byte[] image;
    @Id
    @Column(name="OFFENCE_DETAIL_ID", nullable = false)
    private Long offenceDetailId;
    @Column(name="OFFENCE_STATUS", length = 20)
    private String offenceStatus;
    @Column(nullable = false, length = 200)
    private String place;
    @Column(nullable = false)
    private Timestamp time;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "REPORTED_BY")
    private TmUsermaster tmUsermaster;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "OFFENCE_ID")
    private TmOffence tmOffence;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "VEH_NO" , referencedColumnName = "VEH_NO")
    private TmRegdetails tmRegdetails;

    public TmOffenceDetails() {
    }

    public TmOffenceDetails(Long offenceDetailId, TmOffence tmOffence,
                            String offenceStatus, String place,
                            TmUsermaster tmUsermaster, Timestamp time,
                            TmRegdetails tmRegdetails) {
        this.offenceDetailId = offenceDetailId;
        this.tmOffence = tmOffence;
        this.offenceStatus = offenceStatus;
        this.place = place;
        this.tmUsermaster = tmUsermaster;
        this.time = time;
        this.tmRegdetails = tmRegdetails;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public Long getOffenceDetailId() {
        return offenceDetailId;
    }

    public void setOffenceDetailId(Long offenceDetailId) {
        this.offenceDetailId = offenceDetailId;
    }


    public String getOffenceStatus() {
        return offenceStatus;
    }

    public void setOffenceStatus(String offenceStatus) {
        this.offenceStatus = offenceStatus;
    }

    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
    }


    public Timestamp getTime() {
        return time;
    }

    public void setTime(Timestamp time) {
        this.time = time;
    }


    public TmUsermaster getTmUsermaster() {
        return tmUsermaster;
    }

    public void setTmUsermaster(TmUsermaster tmUsermaster) {
        this.tmUsermaster = tmUsermaster;
    }

    public TmOffence getTmOffence() {
        return tmOffence;
    }

    public void setTmOffence(TmOffence tmOffence) {
        this.tmOffence = tmOffence;
    }

    public TmRegdetails getTmRegdetails() {
        return tmRegdetails;
    }

    public void setTmRegdetails(TmRegdetails tmRegdetails) {
        this.tmRegdetails = tmRegdetails;
    }
}
