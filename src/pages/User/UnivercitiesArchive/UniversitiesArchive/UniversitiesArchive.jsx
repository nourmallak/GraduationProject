// import React, { useContext, useEffect, useState } from 'react';
// import style from '../UniversitiesArchive/UniversitiesArchive.module.css';
// import { Link, useParams } from 'react-router-dom';
// import axios from 'axios';
// import 'animate.css';
// import { Button } from 'react-bootstrap';
// import { FiEdit, FiPlus, FiTrash2 } from 'react-icons/fi';
// import AddCompetitionToUni from '../../../../components/ArchiveControls/AddCompetitionToUni/AddCompetitionToUni';
// import { UserContext } from '../../../../context/Context';
// import UpdateCompetition from '../../../../components/ArchiveControls/UpdateCompetition/UpdateCompetition';
// import DeleteCompetition from '../../../../components/ArchiveControls/DeleteCompetition/DeleteCompetition';
// import Loader from '../../../../Loader/Loader';

// export default function UniversitiesArchive() {
//     const [competitions, setCompetitions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedCompetition, setSelectedCompetition] = useState(null);
//     const role = localStorage.getItem('userRole');
//     const [isSubAdmin, setIsSubAdmin] = useState(role === 'Sub_Admin' ? true : false);
//     const [searchTerm, setSearchTerm] = useState('');

//     const { id } = useParams();
//     const {
//         showAddCompetitionModal, setShowAddCompetitionModal,
//         showDeleteCommpetitionModal, setShowDeleteCommpetitionModal,
//         showUpdateCommpetitionModal, setShowUpdateCommpetitionModal
//     } = useContext(UserContext);

//     const getCompetitions = async (id) => {
//         try {
//             setCompetitions(null);
//             const response = await axios.get(`${import.meta.env.VITE_API}/Compitions/GetAllCompetitionsForUniversity/${id}`) || '';
//             setCompetitions(response.data);
//         } catch (error) {
//             console.error("Failed to fetch competitions:", error);
//         }
//     };

//     const handleSearch = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             const token = localStorage.getItem('user token');

//             const response = await axios.get(
//                 `${import.meta.env.VITE_API}/Compitions/SearchCompetitionsByNameOrParticipant?searchText=${searchTerm}&universityId=${id}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );

//             setCompetitions(response.data);
//         } catch (error) {
//             console.error("Search failed:", error);
//             setCompetitions([]);
//         } finally {
//             setLoading(false);
//         }
//     };


//     const toggleAddCompetitionModal = () => setShowAddCompetitionModal(!showAddCompetitionModal);
//     const toggleDeleteCompetitionModal = (comp) => {
//         setSelectedCompetition(comp);
//         setShowDeleteCommpetitionModal(!showDeleteCommpetitionModal);
//     };
//     const toggleUpdateCommpetitionModal = (comp) => {
//         setSelectedCompetition(comp);
//         setShowUpdateCommpetitionModal(!showUpdateCommpetitionModal);
//     };

//     useEffect(() => {
//         setLoading(true);
//         getCompetitions(id);
//         const delay = setTimeout(() => setLoading(false), 1500);
//         return () => clearTimeout(delay);
//     }, []);

//     return (
//         <div className={style.body}>
//             {loading ? <Loader /> : (
//                 <div className="container">

//                     {/* Search Section */}
//                     <div className={`${style.search} animate__animated animate__fadeInDown`}>
//                         <form className="d-flex flex-column flex-md-row gap-2 mb-3 mt-5" onSubmit={handleSearch}>
//                             <input
//                                 className={`${style.searchinput} form-control`}
//                                 type="text"
//                                 placeholder="Search by participant name or competition name"
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                             <button className={`${style.searchbtn}`} type="submit">
//                                 Search
//                             </button>
//                             {searchTerm && (
//                                 <button
//                                     className={`${style.searchbtn} btn btn-secondary`}
//                                     type="button"
//                                     onClick={() => {
//                                         setSearchTerm('');
//                                         getCompetitions(id);
//                                     }}
//                                 >
//                                     Reset
//                                 </button>
//                             )}
//                         </form>
//                     </div>


//                     {isSubAdmin && (
//                         <div className={style.sectionSubAdminControls}>
//                             <Button onClick={toggleAddCompetitionModal} className={style.addBtn}>
//                                 <FiPlus size={18} /> Add Competition
//                             </Button>
//                         </div>
//                     )}

//                     {/* Cards Section */}
//                     <div className={`${style.cards} row row-cols-md-3 row-cols-sm-1 g-4`}>
//                         {competitions?.length > 0 ? (
//                             competitions.map((competition, index) => (
//                                 <div className="col-3-lg col-6-md col-12-sm animate__animated animate__fadeIn" key={competition.competitionId} style={{ animationDelay: `${index * 0.2}s` }}>
//                                     <Link to={`/universitycompetition/${competition.competitionId}`}>
//                                         <div className={`${style.card} card`}>
//                                             <img src={competition.image} className="card-img-top" alt={competition.name} />
//                                             <div className="card-body">
//                                                 <h5 className="card-title">{competition.name}</h5>
//                                             </div>
//                                         </div>
//                                     </Link>
//                                     {isSubAdmin && (
//                                         <div className={style.sectionSubAdminControlsComp}>
//                                             <Button onClick={() => toggleUpdateCommpetitionModal(competition)} className={style.editBtn}>
//                                                 <FiEdit size={14} />
//                                             </Button>
//                                             <Button onClick={() => toggleDeleteCompetitionModal(competition)} className={style.deleteBtn}>
//                                                 <FiTrash2 size={14} />
//                                             </Button>
//                                         </div>
//                                     )}
//                                 </div>
//                             ))
//                         ) : (
//                             <h2 className={style.noResults}>There are no competitions</h2>
//                         )}
//                     </div>

//                     {/* Modals */}
//                     <AddCompetitionToUni
//                         show={showAddCompetitionModal}
//                         onHide={() => setShowAddCompetitionModal(false)}
//                         universityId={id}
//                     />
//                     <UpdateCompetition
//                         show={showUpdateCommpetitionModal}
//                         onHide={toggleUpdateCommpetitionModal}
//                         currentCompetition={selectedCompetition}
//                     />
//                     <DeleteCompetition
//                         show={showDeleteCommpetitionModal}
//                         onHide={toggleDeleteCompetitionModal}
//                         competition={selectedCompetition}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// }
import React, { useContext, useEffect, useState } from 'react';
import style from '../UniversitiesArchive/UniversitiesArchive.module.css';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import 'animate.css';
import { Button } from 'react-bootstrap';
import { FiEdit, FiPlus, FiTrash2 } from 'react-icons/fi';
import AddCompetitionToUni from '../../../../components/ArchiveControls/AddCompetitionToUni/AddCompetitionToUni';
import { UserContext } from '../../../../context/Context';
import UpdateCompetition from '../../../../components/ArchiveControls/UpdateCompetition/UpdateCompetition';
import DeleteCompetition from '../../../../components/ArchiveControls/DeleteCompetition/DeleteCompetition';
import Loader from '../../../../Loader/Loader';
import { jwtDecode } from 'jwt-decode';

export default function UniversitiesArchive() {
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const role = localStorage.getItem('userRole');
    const [isSubAdmin, setIsSubAdmin] = useState(role === 'Sub_Admin' ? true : false);
    const [searchTerm, setSearchTerm] = useState('');
    const {
        showAddCompetitionModal, setShowAddCompetitionModal,
        showDeleteCommpetitionModal, setShowDeleteCommpetitionModal,
        showUpdateCommpetitionModal, setShowUpdateCommpetitionModal, universityInfo
    } = useContext(UserContext);
    const [currentUserId, setCurrentUserId] = useState(0);
    useEffect(() => {
        const token = localStorage.getItem("user token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                setCurrentUserId(parseInt(userId));
            } catch (e) {
                console.error("Token decode error:", e);
            }
        }
    }, []);
    const isCurrentSubAdminOfUniversity = () => {
        if (role !== "Sub_Admin" || !universityInfo?.subAdmins) return false;
        return universityInfo.subAdmins.some((admin) => admin.id === currentUserId);
    };

    const { id } = useParams();

    const getCompetitions = async (id) => {
        try {
            setCompetitions(null);
            const response = await axios.get(`${import.meta.env.VITE_API}/Compitions/GetAllCompetitionsForUniversity/${id}`) || '';
            setCompetitions(response.data);
        } catch (error) {
            console.error("Failed to fetch competitions:", error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('user token');

            const response = await axios.get(
                `${import.meta.env.VITE_API}/Compitions/SearchCompetitionsByNameOrParticipant?searchText=${searchTerm}&universityId=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

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
            await getCompetitions(id);
        } catch (error) {
            console.error("Action failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        getCompetitions(id);
        const delay = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(delay);
    }, []);


    return (
        <div className={style.body}>
            {loading ? <Loader /> : (
                <div className="container">

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
                                        getCompetitions(id);
                                    }}
                                >
                                    Reset
                                </button>
                            )}
                        </form>
                    </div>


                    {isCurrentSubAdminOfUniversity() && (
                        <div className={style.sectionSubAdminControls}>
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
                                    <Link to={`/universitycompetition/${competition.id}`}>
                                        <div className={`${style.card} card`}>
                                            <img src={competition.image} className="card-img-top" alt={competition.name} />
                                            <div className="card-body">
                                                <h5 className="card-title">{competition.name}</h5>
                                            </div>
                                        </div>
                                    </Link>
                                    {isCurrentSubAdminOfUniversity() && (
                                        <div className={style.sectionSubAdminControlsComp}>
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
                    <AddCompetitionToUni
                        show={showAddCompetitionModal}
                        onHide={() => setShowAddCompetitionModal(false)}
                        universityId={id}
                        onSuccess={() => handleCompetitionAction(() => getCompetitions(id))}
                    />

                    <UpdateCompetition
                        show={showUpdateCommpetitionModal}
                        onHide={toggleUpdateCommpetitionModal}
                        currentCompetition={selectedCompetition}
                        onSuccess={() => handleCompetitionAction(() => getCompetitions(id))}
                    />
                    <DeleteCompetition
                        show={showDeleteCommpetitionModal}
                        onHide={toggleDeleteCompetitionModal}
                        currentCompetition={selectedCompetition}
                        onSuccess={() => handleCompetitionAction(() => getCompetitions(id))}
                    />
                </div>
            )}
        </div>
    );
}
