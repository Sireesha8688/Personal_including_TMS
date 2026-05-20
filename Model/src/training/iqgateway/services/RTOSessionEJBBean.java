package training.iqgateway.services;

import java.util.Collections;
import java.util.List;

import javax.ejb.Stateless;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import javax.persistence.TypedQuery;

import training.iqgateway.entities.TmOffence;
import training.iqgateway.entities.TmOffenceDetails;

import training.iqgateway.entities.TmOwnerdetails;
import training.iqgateway.entities.TmRegdetails;
import training.iqgateway.entities.TmVehicledetails;

@Stateless(name = "RTOSessionEJB", mappedName = "TMS-Using JEE-Model-RTOSessionEJB")
public class RTOSessionEJBBean implements RTOSessionEJB, RTOSessionEJBLocal {
    @PersistenceContext(unitName="Model")
    private EntityManager em;

    public RTOSessionEJBBean() {
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

    public TmVehicledetails persistTmVehicledetails(TmVehicledetails tmVehicledetails) {
        em.persist(tmVehicledetails);
        return tmVehicledetails;
    }

    public TmVehicledetails mergeTmVehicledetails(TmVehicledetails tmVehicledetails) {
        return em.merge(tmVehicledetails);
    }

    public void removeTmVehicledetails(TmVehicledetails tmVehicledetails) {
        tmVehicledetails = em.find(TmVehicledetails.class, tmVehicledetails.getVehId());
        em.remove(tmVehicledetails);
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

    public TmOwnerdetails persistTmOwnerdetails(TmOwnerdetails tmOwnerdetails) {
        em.persist(tmOwnerdetails);
        return tmOwnerdetails;
    }

    public TmOwnerdetails mergeTmOwnerdetails(TmOwnerdetails tmOwnerdetails) {
        return em.merge(tmOwnerdetails);
    }

    public void removeTmOwnerdetails(TmOwnerdetails tmOwnerdetails) {
        tmOwnerdetails = em.find(TmOwnerdetails.class, tmOwnerdetails.getOwnerId());
        em.remove(tmOwnerdetails);
    }

    /** <code>select o from TmOwnerdetails o</code> */
    public List<TmOwnerdetails> getTmOwnerdetailsFindAll() {
        return em.createNamedQuery("TmOwnerdetails.findAll").getResultList();
    }

    public TmRegdetails persistTmRegdetails(TmRegdetails tmRegdetails) {
        em.persist(tmRegdetails);
        return tmRegdetails;
    }

    public TmRegdetails mergeTmRegdetails(TmRegdetails tmRegdetails) {
        return em.merge(tmRegdetails);
    }

    public void removeTmRegdetails(TmRegdetails tmRegdetails) {
        tmRegdetails = em.find(TmRegdetails.class, tmRegdetails.getVehNo());
        em.remove(tmRegdetails);
    }

    /** <code>select o from TmRegdetails o</code> */
    public List<TmRegdetails> getTmRegdetailsFindAll() {
        return em.createNamedQuery("TmRegdetails.findAll").getResultList();
    }

    @Override
    public TmOwnerdetails findTmOwnerdetailsById(Long ownerId) {
        return em.find(TmOwnerdetails.class, ownerId);
    }

    @Override
    public TmRegdetails findByVehicleNumber(String vehicleNo) {
        try {
            Query query = em.createQuery("SELECT r FROM TmRegdetails r WHERE r.vehNo = :vehicleNo");
            query.setParameter("vehicleNo", vehicleNo);
            return (TmRegdetails) query.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public List<TmOffenceDetails> getPendingOffencesByVehicleNo(String vehicleNo) {
        Query query = em.createQuery(
            "SELECT o FROM TmOffenceDetails o WHERE o.tmRegdetails.vehNo = :vehNo AND LOWER(o.offenceStatus) != 'cleared'");
        query.setParameter("vehNo", vehicleNo);
        return query.getResultList();
    }


    @Override
    public TmOffenceDetails findTmOffenceDetailsById(Long offenceDetailId) {
        return em.find(TmOffenceDetails.class, offenceDetailId);
    }
    
    
   

    @Override
    public TmOwnerdetails findOwnerByPanCardNo(String pancardNo) {
        try {
            // Use untyped createQuery for compatibility
            Query query = em.createQuery("SELECT t FROM TmOwnerdetails t WHERE t.pancardNo = :pancardNo");
            query.setParameter("pancardNo", pancardNo);
            return (TmOwnerdetails) query.getSingleResult();
        } catch (NoResultException e) {
            return null; // No matching entity found
        }
    }



}
