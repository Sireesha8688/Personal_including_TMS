package training.iqgateway.services;

import java.util.List;

import javax.ejb.Stateless;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import training.iqgateway.entities.TmOffence;
import training.iqgateway.entities.TmOffenceDetails;
import training.iqgateway.entities.TmOwnerdetails;
import training.iqgateway.entities.TmVehicledetails;

@Stateless(name = "COPSessionEJB", mappedName = "TMS-Using JEE-Model-COPSessionEJB")
public class COPSessionEJBBean implements COPSessionEJB, COPSessionEJBLocal {
    @PersistenceContext(unitName="Model")
    private EntityManager em;

    public COPSessionEJBBean() {
    }

    public Object queryByRange(String jpqlStmt, int firstResult,
                               int maxResults) {
        Query query = em.createQuery(jpqlStmt);
        if (firstResult > 0) {
            query = query.setFirstResult(firstResult);
        }
        if (maxResults > 0) {
            query = query.setMaxResults(maxResults);
        }
        return query.getResultList();
    }

    public TmOffence persistTmOffence(TmOffence tmOffence) {
        em.persist(tmOffence);
        return tmOffence;
    }

    public TmOffence mergeTmOffence(TmOffence tmOffence) {
        return em.merge(tmOffence);
    }

    public void removeTmOffence(TmOffence tmOffence) {
        tmOffence = em.find(TmOffence.class, tmOffence.getOffenceId());
        em.remove(tmOffence);
    }

    /** <code>select o from TmOffence o</code> */
    public List<TmOffence> getTmOffenceFindAll() {
        return em.createNamedQuery("TmOffence.findAll").getResultList();
    }

    /** <code>select o from TmVehicledetails o</code> */
    public List<TmVehicledetails> getTmVehicledetailsFindAll() {
        return em.createNamedQuery("TmVehicledetails.findAll").getResultList();
    }

    public TmOffenceDetails persistTmOffenceDetails(TmOffenceDetails tmOffenceDetails) {
        em.persist(tmOffenceDetails);
        return tmOffenceDetails;
    }

    public TmOffenceDetails mergeTmOffenceDetails(TmOffenceDetails tmOffenceDetails) {
        return em.merge(tmOffenceDetails);
    }

    public void removeTmOffenceDetails(TmOffenceDetails tmOffenceDetails) {
        tmOffenceDetails = em.find(TmOffenceDetails.class, tmOffenceDetails.getOffenceDetailId());
        em.remove(tmOffenceDetails);
    }

    /** <code>select o from TmOffenceDetails o</code> */
    public List<TmOffenceDetails> getTmOffenceDetailsFindAll() {
        return em.createNamedQuery("TmOffenceDetails.findAll").getResultList();
    }

    /** <code>select o from TmOwnerdetails o</code> */
    public List<TmOwnerdetails> getTmOwnerdetailsFindAll() {
        return em.createNamedQuery("TmOwnerdetails.findAll").getResultList();
    }
}
