package training.iqgateway.services;

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
import training.iqgateway.entities.TmUsermaster;
import training.iqgateway.entities.TmVehicledetails;

@Stateless(name = "ClerkSessionEJB", mappedName = "TMS-Using JEE-Model-ClerkSessionEJB")
public class ClerkSessionEJBBean implements ClerkSessionEJB,
                                            ClerkSessionEJBLocal {
    @PersistenceContext(unitName="Model")
    private EntityManager em;

    public ClerkSessionEJBBean() {
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
    
    public TmOffence findTmOffenceById(Long offenceId) {
        return em.find(TmOffence.class, offenceId);
    }
    @Override
    public TmRegdetails findVehicleByNumber(String vehicleNo) {
        try {
            return em.createQuery("SELECT r FROM TmRegdetails r WHERE r.vehNo = :vehNo", TmRegdetails.class)
                    .setParameter("vehNo", vehicleNo)
                    .getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }
    @Override
    public TmOffence getTmOffenceById(Long offenceId) {
        return em.find(TmOffence.class, offenceId);
    }


    @Override
        public TmRegdetails findByVehicleNumber(String vehicleNo) {
            try {
                Query query = em.createQuery("SELECT r FROM TmRegdetails r WHERE r.vehNo = :vehNo");
                query.setParameter("vehNo", vehicleNo);
                return (TmRegdetails) query.getSingleResult();
            } catch (Exception e) {
                return null;
            }
        }

    public TmOwnerdetails findTmOwnerdetailsById(Long ownerId) {
        return em.find(TmOwnerdetails.class, ownerId);
    }

    public void removeTmOwnerdetails(TmOwnerdetails owner) {
        TmOwnerdetails ownerToDelete = em.find(TmOwnerdetails.class, owner.getOwnerId());
               if (ownerToDelete != null) {
                   em.remove(ownerToDelete);
               }
    }

    public TmVehicledetails findTmVehicledetailsById(Long vehId) {
        return em.find(TmVehicledetails.class, vehId);
        
    }

    public void removeTmVehicledetails(TmVehicledetails vehicle) {
        vehicle = em.find(TmVehicledetails.class, vehicle.getVehId());
          em.remove(vehicle);
    }
    
    @Override
    public TmUsermaster findTmUsermasterByUsername(String username) {
        Query query = em.createQuery("SELECT u FROM TmUsermaster u WHERE u.username = :username");
        query.setParameter("username", username);
        try {
            return (TmUsermaster) query.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }

    }
    
    @Override
    public List<TmOffenceDetails> findPendingOffencesByVehicleNo(String vehicleNo) {
        String jpql = "SELECT o FROM TmOffenceDetails o "
                    + "JOIN FETCH o.tmOffence "
                    + "JOIN FETCH o.tmRegdetails "
                    + "WHERE LOWER(o.offenceStatus) = 'pending' "
                    + "AND LOWER(o.tmRegdetails.vehNo) = :vehNo";
        Query query = em.createQuery(jpql);  // Use javax.persistence.Query, no class parameter
        query.setParameter("vehNo", vehicleNo.toLowerCase());
        return query.getResultList();
    }


}
