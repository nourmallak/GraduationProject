import React, { useContext, useEffect, useState } from 'react';
import style from '../publicArchive/publicArchive.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'animate.css';
import { Button } from 'react-bootstrap';
import { FiEdit, FiPlus, FiTrash2 } from 'react-icons/fi';
import AddCompetition from '../../../../components/ArchiveControls/AddCompetition/AddCompetition';
import UpdateCompetition from '../../../../components/ArchiveControls/UpdateCompetition/UpdateCompetition';
import DeleteCompetition from '../../../../components/ArchiveControls/DeleteCompetition/DeleteCompetition';
import { UserContext } from '../../../../context/Context';
import Loader from '../../../../Loader/Loader';

export default function PublicArchive() {
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState(1);
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const token = localStorage.getItem("user token");
    const role = localStorage.getItem('userRole');
    const [isAdmin, setIsAdmin] = useState(token && role === 'Admin');
    const [searchTerm, setSearchTerm] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);


    const {
        showAddCompetitionModal, setShowAddCompetitionModal,
        showDeleteCommpetitionModal, setShowDeleteCommpetitionModal,
        showUpdateCommpetitionModal, setShowUpdateCommpetitionModal
    } = useContext(UserContext);

    const getCompetitions = async (type) => {
        try {
            setCompetitions(null);
            const response = await axios.get(`${import.meta.env.VITE_API}/Compitions/GetCompetitionsByType/${type}`);
            setCompetitions(response.data);
        } catch (error) {
            console.error("Failed to fetch competitions:", error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API}/Teams/Search-Competitions?competitionType=${type}&searchText=${searchTerm}`);
            setCompetitions(response.data);
        } catch (error) {
            console.error("Search failed:", error);
            setCompetitions([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleAddCompetitionModal = () => setShowAddCompetitionModal(!showAddCompetitionModal);

    const toggleDeleteCompetitionModal = (comp) => {
        setSelectedCompetition(comp);
        setShowDeleteCommpetitionModal(!showDeleteCommpetitionModal);
    };
    const toggleUpdateCommpetitionModal = (comp) => {
        setSelectedCompetition(comp);
        setShowUpdateCommpetitionModal(!showUpdateCommpetitionModal);
    };


    const handleCompetitionAction = async (action) => {
        setIsProcessing(true);
        try {
            await action();
            await getCompetitions(type);
        } catch (error) {
            console.error("Action failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        getCompetitions(type);
        const delay = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(delay);
    }, [type]);

    return (
        <div className={style.body}>
            {loading ? <Loader /> : (
                <div className="container">

                    {/* Search Section */}
                    <div className={`${style.search} animate__animated animate__fadeInDown`}>
                        <form className="d-flex flex-column flex-md-row gap-2 mb-3 mt-5" onSubmit={handleSearch}>
                            <input
                                className={`${style.searchinput} form-control `}
                                type="text"
                                placeholder="Search by participant name, competition name ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className={`${style.searchbtn}`}
                                type="submit"
                                disabled={!searchTerm}>
                                Search
                            </button>
                            {(searchTerm) && (
                                <button
                                    className={`${style.searchbtn} btn btn-secondary`}
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm('');
                                        getCompetitions(type);
                                    }}
                                >
                                    Reset
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Button Group */}
                    <div className={`${style.btnGroupCustom} d-flex flex-nowrap  gap-2 animate__animated animate__fadeInUp`}>
                        <button
                            className={`${style.btn} flex-fill ${type === 1 ? style.activeBtn : ''}`}
                            onClick={() => setType(1)}
                        >
                            PCPC
                        </button>
                        <button
                            className={`${style.btn} flex-fill ${type === 3 ? style.activeBtn : ''}`}
                            onClick={() => setType(3)}
                        >
                            ACPC
                        </button>
                        <button
                            className={`${style.btn} flex-fill ${type === 2 ? style.activeBtn : ''}`}
                            onClick={() => setType(2)}
                        >
                            ICPC
                        </button>
                    </div>



                    {isAdmin && (
                        <div className={style.sectionAdminControls}>
                            <Button onClick={toggleAddCompetitionModal} className={style.addBtn}>
                                <FiPlus size={18} /> Add Competition
                            </Button>
                        </div>
                    )}

                    {/* Cards Section */}
                    <div className={`${style.cards} row row-cols-md-3 row-cols-sm-1 g-4`}>
                        {competitions?.length > 0 ? (
                            competitions.map((competition, index) => (
                                <div className="col-3-lg col-6-md col-12-sm animate__animated animate__fadeIn" key={competition.id} style={{ animationDelay: `${index * 0.2}s` }}>
                                    <Link to={`/competition/${competition.id}`}>
                                        <div className={`${style.card} card`}>
                                            <img src={competition.image} className="card-img-top" alt={competition.name} />
                                            <div className="card-body">
                                                <h5 className="card-title">{competition.name}</h5>
                                            </div>
                                        </div>
                                    </Link>
                                    {isAdmin && (
                                        <div className={style.sectionAdminControlsComp}>
                                            <Button onClick={() => toggleUpdateCommpetitionModal(competition)} className={style.editBtn}>
                                                <FiEdit size={14} />
                                            </Button>
                                            <Button onClick={() => toggleDeleteCompetitionModal(competition)} className={style.deleteBtn}>
                                                <FiTrash2 size={14} />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <h2 className={style.noResults}>There are no competitions</h2>
                        )}
                    </div>

                    {/* Modals */}
                    <AddCompetition
                        show={showAddCompetitionModal}
                        onHide={() => setShowAddCompetitionModal(false)}
                        type={type - 1}
                        onSuccess={() => handleCompetitionAction(() => getCompetitions(type))}
                    />
                    <UpdateCompetition
                        show={showUpdateCommpetitionModal}
                        onHide={toggleUpdateCommpetitionModal}
                        currentCompetition={selectedCompetition}
                        onSuccess={() => handleCompetitionAction(() => getCompetitions(type))}
                    />
                    <DeleteCompetition
                        show={showDeleteCommpetitionModal}
                        onHide={toggleDeleteCompetitionModal}
                        currentCompetition={selectedCompetition}
                        onSuccess={() => handleCompetitionAction(() => getCompetitions(type))}
                    />
                </div>
            )}
        </div>
    );
}
