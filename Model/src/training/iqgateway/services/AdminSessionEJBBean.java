package training.iqgateway.services;

import java.util.List;

import javax.ejb.Stateless;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import training.iqgateway.entities.TmRolemaster;
import training.iqgateway.entities.TmUsermaster;

@Stateless(name = "AdminSessionEJB", mappedName = "TMS-Using JEE-Model-AdminSessionEJB")
public class AdminSessionEJBBean implements AdminSessionEJB,
                                            AdminSessionEJBLocal {
    @PersistenceContext(unitName="Model")
    private EntityManager em;

    public AdminSessionEJBBean() {
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

    public TmUsermaster persistTmUsermaster(TmUsermaster tmUsermaster) {
        em.persist(tmUsermaster);
        return tmUsermaster;
    }

    public TmUsermaster mergeTmUsermaster(TmUsermaster tmUsermaster) {
        return em.merge(tmUsermaster);
    }

    public void removeTmUsermaster(TmUsermaster tmUsermaster) {
        tmUsermaster = em.find(TmUsermaster.class, tmUsermaster.getUsername());
        em.remove(tmUsermaster);
    }

    /** <code>select o from TmUsermaster o</code> */
    public List<TmUsermaster> getTmUsermasterFindAll() {
        return em.createNamedQuery("TmUsermaster.findAll").getResultList();
    }

    public TmRolemaster persistTmRolemaster(TmRolemaster tmRolemaster) {
        em.persist(tmRolemaster);
        return tmRolemaster;
    }

    public TmRolemaster mergeTmRolemaster(TmRolemaster tmRolemaster) {
        return em.merge(tmRolemaster);
    }

    public void removeTmRolemaster(TmRolemaster tmRolemaster) {
        tmRolemaster = em.find(TmRolemaster.class, tmRolemaster.getRolename());
        em.remove(tmRolemaster);
    }

    /** <code>select o from TmRolemaster o</code> */
    public List<TmRolemaster> getTmRolemasterFindAll() {
        return em.createNamedQuery("TmRolemaster.findAll").getResultList();
    }
}
