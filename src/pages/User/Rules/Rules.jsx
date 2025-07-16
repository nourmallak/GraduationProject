import React, { useEffect, useState, useContext } from 'react';
import style from './Rules.module.css';
import { FiEdit, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Button } from 'react-bootstrap';
import 'animate.css';
import axios from 'axios';
import Loader from '../../../Loader/Loader';
import { UserContext } from '../../../context/Context';
import AddRule from '../../../components/RulesComponents/AddRule/AddRule';
import UpdateRule from '../../../components/RulesComponents/UpdateRule/UpdateRule';
import DeleteRule from '../../../components/RulesComponents/DeleteRule/DeleteRule';

export default function Rules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRule, setSelectedRule] = useState(null);

  const role = localStorage.getItem('userRole');
  const isAdmin = role === 'Admin';

  const {
    showAddRuleModal, setShowAddRuleModal,
    showEditRuleModal, setShowEditRuleModal,
    showDeleteRuleModal, setShowDeleteRuleModal
  } = useContext(UserContext);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API}/Rule/Get-All-Rules`);
      setRules(data);
    } catch (error) {
      console.error("Error fetching rules:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalAction = async (action) => {
    try {
      await action();
      await fetchRules();
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const toggleAddModal = () => setShowAddRuleModal(!showAddRuleModal);
  const toggleEditModal = (rule) => {
    setSelectedRule(rule);
    setShowEditRuleModal(true);
  };
  const toggleDeleteModal = (rule) => {
    setSelectedRule(rule);
    setShowDeleteRuleModal(true);
  };


  useEffect(() => {
    setLoading(true);
    fetchRules();
    const delay = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(delay);
  }, []);
  return (
    <div className={style.pageWrapper}>
      {loading ? <Loader /> : (
        <div className="container">
          <h2 className={`${style.pageTitle} animate__animated animate__fadeInDown`}>Rules</h2>

          {isAdmin && (
            <div className={style.addButtonContainer}>
              <Button onClick={toggleAddModal} className={style.primaryButton}>
                <FiPlus size={18} /> Add Rule
              </Button>
            </div>
          )}

          <div className={style.rulesList}>
            {rules?.length > 0 ? (
              rules.map((rule, index) => (
                <div
                  key={rule.id}
                  className={`animate__animated animate__fadeInUp ${style.ruleItem}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={style.ruleRow}>
                    <h5 className={style.ruleTitle}>{rule.title}</h5>
                    {isAdmin && (
                      <div className={style.actions}>
                        <Button onClick={() => toggleEditModal(rule)} className={style.iconButton}>
                          <FiEdit />
                        </Button>
                        <Button onClick={() => toggleDeleteModal(rule)} className={style.iconButtonDelete}>
                          <FiTrash2 />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className={style.descriptionList}>
                    {rule.description.map((item, i) => (
                      <div key={i} className={style.descriptionItem}>
                        <span className={style.bullet}>•</span>
                        <span className={style.text}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center mt-5">
                <h4 className={style.noResults}>No rules found.</h4>
              </div>
            )}
          </div>

          <AddRule
            show={showAddRuleModal}
            onHide={() => setShowAddRuleModal(false)}
            onSuccess={() => handleModalAction(fetchRules)}
          />

          <UpdateRule
            show={showEditRuleModal}
            onHide={() => setShowEditRuleModal(false)}
            rule={selectedRule}
            onSuccess={() => handleModalAction(fetchRules)}
          />

          <DeleteRule
            show={showDeleteRuleModal}
            onHide={() => setShowDeleteRuleModal(false)}
            rule={selectedRule}
            onSuccess={() => handleModalAction(fetchRules)}
          />
        </div>
      )}
    </div>
  );
}
