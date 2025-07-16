import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FiSearch, FiChevronDown, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { Crown, Link, Medal } from "phosphor-react";
import { FaAward } from "react-icons/fa6";
import { Modal, Button } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'react-toastify/dist/ReactToastify.css';
import questions from '../../../../images/insidaArchive/questions.png';
import style from "../UniversityInsideArchive/UniversityInsideArchive.module.css";
import logo from '../../../../images/logo/logo.png'
import { useParams } from "react-router-dom";
import AddImages from "../../../../components/ArchiveControls/AddImages/AddImages";
import DeleteImages from "../../../../components/ArchiveControls/DeleteImages/DeleteImage";
import AddTeam from "../../../../components/ArchiveControls/AddTeam/AddTeam";
import DeleteTeam from "../../../../components/ArchiveControls/DeleteTeam/DeleteTeam";
import AddParticipant from "../../../../components/ArchiveControls/AddParticipant/AddParticipant";
import DeleteParticipant from "../../../../components/ArchiveControls/DeleteParticipant/DeleteParticipant";
import UpdateTeam from "../../../../components/ArchiveControls/UpdateTeam/UpdateTeam";
import UpdateDescription from "../../../../components/ArchiveControls/UpdateDescription/UpdateDescription";
import { UserContext } from "../../../../context/Context";
import Loader from "../../../../Loader/Loader";
import AddQuestionsPDF from "../../../../components/ArchiveControls/AddQuestionsPDF/AddQuestionsPDF";
import UpdateInvitation from "../../../../components/ArchiveControls/UpdateInvitation/UpdateInvitation";
import AddOrUpdateQuestionsPdf from "../../../../components/ArchiveControls/UpdateQuestionsPDF/UpdateQuestionsPDF";
import { jwtDecode } from "jwt-decode";

export default function InsideArchive() {
    const [competition, setCompetition] = useState({});
    const [locations, setLocations] = useState([]);
    const [expandedTeamId, setExpandedTeamId] = useState(null);
    const role = localStorage.getItem('userRole');
    const [isSubAdmin, setIsSubAdmin] = useState(role === 'Sub_Admin' ? true : false);
    const [selectedImageId, setSelectedImageId] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const { competitionId } = useParams();

    const {
        showAddImageModal, setShowAddImageModal,
        showDeleteImageModal, setShowDeleteImageModal,
        showDeleteLocationModal, setShowDeleteLocationModal,
        showAddTeamModal, setShowAddTeamModal,
        showDeleteTeamModal, setShowDeleteTeamModal,
        showUpdateTeamModal, setShowUpdateTeamModal,
        showAddParticipantModal, setShowAddParticipantModal,
        showDeleteParticipantModal, setShowDeleteParticipantModal,
        showUpdateDescriptionModal, setShowUpdateDescriptionModal,
        showAddLocationModal, setShowAddLocationModal,
        showUpdateQuestionsPDFModal, setShowUpdateQuestionsPDFModal,
        showUpdateInvitationModal, setShowUpdateInvitationModal, universityInfo
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


    async function getCompetition() {
        try {
            const data = await axios.get(`${import.meta.env.VITE_API}/Compitions/GetCompetitionDetails/${competitionId}`);
            setCompetition(data.data);
        } catch (error) {
            console.error("Failed to fetch competitions:", error);
        }
    }

    const toggleAddImageModal = () => setShowAddImageModal(!showAddImageModal);
    const toggleAddLocationModal = () => setShowAddLocationModal(!showAddLocationModal);

    const toggleDeleteImageModal = (id) => {
        setSelectedImageId(id);
        setShowDeleteImageModal(!showDeleteImageModal);
    };

    const toggleUpdateQuestionsPDFModal = () => {
        setShowUpdateQuestionsPDFModal(!showUpdateQuestionsPDFModal);
    };

    const toggleUpdateInvitationModal = () => {
        setShowUpdateInvitationModal(!showUpdateInvitationModal);
    };

    const toggleAddTeamModal = () => setShowAddTeamModal(!showAddTeamModal);

    const toggleDeleteTeamModal = (team) => {
        setSelectedTeam(team);
        setShowDeleteTeamModal(!showDeleteTeamModal);
    };

    const toggleUpdateTeamModal = (team = null) => {
        setSelectedTeam(team);
        setShowUpdateTeamModal(!showUpdateTeamModal);
    };

    const toggleAddParticipantModal = (team = null) => {
        setSelectedTeam(team);
        setShowAddParticipantModal(!showAddParticipantModal);
    };

    const toggleDeleteParticipantModal = (participant, team) => {
        setSelectedParticipant(participant);
        setSelectedTeam(team);
        setShowDeleteParticipantModal(!showDeleteParticipantModal);
    };

    const toggleUpdateDescriptionModal = () => setShowUpdateDescriptionModal(!showUpdateDescriptionModal);

    const toggleTeamParticipants = (teamId) => {
        setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/Teams/Get-Teams-By-ParticipantName-And-Competition?participantName=${searchTerm}&competitionId=${competitionId}`
            );
            setFilteredTeams(response.data);
        } catch (error) {
            console.error("Search failed:", error);
        }
    };

    const teamsToDisplay = searchTerm && filteredTeams.length > 0 ? filteredTeams : competition.teams || [];
    const handleCompetitionAction = async (action) => {
        setIsProcessing(true);
        try {
            await action();
            await getCompetition(competitionId);
        } catch (error) {
            console.error("Action failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        getCompetition(competitionId);
        const delay = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(delay);
    }, [competitionId]);


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={style.body}
        >
            {loading ? <Loader /> :
                <div className="container">
                    {/* Title Section */}
                    <motion.h1
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className={style.title}
                    >
                        {competition.name}
                    </motion.h1>

                    {/* Invitation Section */}
                    {isCurrentSubAdminOfUniversity() && (
                        <div className={style.sectionAdminControls}>
                            {competition?.image2 ? (
                                <Button
                                    onClick={toggleUpdateInvitationModal}
                                    className={style.editBtn}
                                >
                                    <FiEdit size={18} /> Edit Invitation
                                </Button>
                            ) :
                                (
                                    <Button
                                        onClick={toggleUpdateInvitationModal}
                                        className={style.addBtn}
                                    >
                                <FiPlus size={18} /> Add Invitation
                                    </Button>
                                )
                            }

                        </div>
                    )}
                    {competition?.image2 && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className={style.firstSection}
                        >
                            <motion.img
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={style.invitation}
                                src={competition.image2}
                                alt="Invitation"
                            />
                        </motion.div>
                    )}
                    {/* Images Carousel */}
                    {isCurrentSubAdminOfUniversity() && (
                        <div className={style.sectionAdminControls}>
                            <Button
                                onClick={toggleAddImageModal}
                                className={style.addBtn}
                            >
                                <FiPlus size={18} /> Add Image
                            </Button>
                        </div>
                    )}
                    {competition?.images?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`${style.carouselContainer}`}
                        >
                            <Swiper
                                effect="coverflow"
                                grabrsor={true}
                                centeredSlides={true}
                                loop={true}
                                slidesPerView="auto"
                                spaceBetween={30}
                                coverflowEffect={{
                                    rotate: 0,
                                    stretch: 0,
                                    depth: 200,
                                    modifier: 2,
                                    slideShadows: false,
                                }}
                                pagination={{ clickable: true }}
                                navigation={true}
                                modules={[EffectCoverflow, Pagination, Navigation]}
                                className={`${style.swiperContainer}`}
                            >

                                {competition?.images.map((image, index) => (
                                    <SwiperSlide key={image.competitionImagesId} className={`${style.swiperSlide}`}>
                                        {isCurrentSubAdminOfUniversity() && (
                                            <div className={style.imageControls}>
                                                <Button
                                                    onClick={() => toggleDeleteImageModal(image.competitionImagesId)}
                                                    className={style.deleteBtn}
                                                >
                                                    <FiTrash2 size={16} />
                                                </Button>
                                            </div>
                                        )}
                                        <motion.img
                                            whileHover={{ scale: 1.1 }}
                                            src={image.imageName}
                                            alt={`Image ${index + 1}`}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </motion.div>
                    )}

                    {/* Description Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className={style.descriptionContainer}
                    >
                        {isCurrentSubAdminOfUniversity() && (
                            <div className={style.sectionAdminControls}>
                                <Button
                                    onClick={toggleUpdateDescriptionModal}
                                    className={`${style.editBtn} ${style.updateDescription}`}
                                >
                                    <FiEdit size={18} /> Edit Description
                                </Button>
                            </div>
                        )}
                        <p className={`${style.description}`}>
                            {competition?.description || "No description available"}
                        </p>
                    </motion.div>

                    {/* time Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className={style.locationsContainer}
                    >

                        <ul className={`${style.list} row d-flex justify-content-center`}>

                            <li className="col-lg-3">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path fill="#fa6300" d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48H0l0-48c0-26.5 21.5-48 48-48l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z" />
                                </svg>
                                <span>
                                    {new Date(competition?.time).toLocaleDateString('EG', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Teams Section */}
                    <div className="d-flex justify-content-end">
                        {isCurrentSubAdminOfUniversity() && ((teamsToDisplay?.length == 0)) && (
                            <div className={style.sectionAdminControls}>
                                <Button
                                    onClick={toggleAddTeamModal}
                                    className={style.addBtn}
                                >
                                    <FiPlus size={18} /> Add Team
                                </Button>
                            </div>
                        )}
                    </div>

                    {(teamsToDisplay?.length > 0) &&
                        (<>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1 }}
                                className={style.teamsContainer}
                            >
                                {/* Header Section */}
                                <div className={style.header}>
                                    <motion.h2
                                        initial={{ x: -20 }}
                                        animate={{ x: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className={style.title}
                                    >
                                        Teams
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.3, type: "spring" }}
                                            className={style.teamCount}
                                        >
                                            {teamsToDisplay.length}
                                        </motion.span>
                                    </motion.h2>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className={style.searchWrapper}
                                    >
                                        <div className={style.searchBox}>
                                            <input
                                                type="text"
                                                placeholder="Search participants..."
                                                className={style.searchInput}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                            />
                                            <Button
                                                onClick={handleSearch}
                                                className={style.searchButton}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">{/*!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.*/}<path fill="#ffffff" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
                                            </Button>
                                        </div>
                                    </motion.div>
                                </div>

                                {isCurrentSubAdminOfUniversity() && (
                                    <div className={style.sectionAdminControls}>
                                        <Button
                                            onClick={toggleAddTeamModal}
                                            className={style.addBtn}
                                        >
                                            <FiPlus size={18} /> Add Team
                                        </Button>
                                    </div>
                                )}

                                {teamsToDisplay?.length > 0 && (<>
                                    {/* Table Section */}
                                    <div className={style.tableOuterContainer}>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.7 }}
                                            className={style.tableBorder}
                                        />

                                        <div className={style.tableInnerContainer}>
                                            <motion.table
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.6, delay: 0.8 }}
                                                className={style.table}
                                            >
                                                {/* Table Header */}
                                                <thead>
                                                    <motion.tr
                                                        initial={{ y: -10 }}
                                                        animate={{ y: 0 }}
                                                        transition={{ duration: 0.4 }}
                                                        className={style.tableHeader}
                                                    >
                                                        <th className={style.rankColumn}>Rank</th>
                                                        <th className={style.teamColumn}>Team</th>
                                                        <th className={style.universityColumn}>University</th>
                                                        <th className={style.coachColumn}>Coach</th>
                                                        {isCurrentSubAdminOfUniversity() && <th className={style.actionsColumn}>Actions</th>}
                                                    </motion.tr>
                                                </thead>

                                                {/* Table Body */}
                                                <tbody>
                                                    {teamsToDisplay.map((team, index) => (
                                                        <React.Fragment key={team.teamId}>
                                                            {/* Team Row */}
                                                            <motion.tr
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ duration: 0.3, delay: 0.1 * index }}
                                                                whileHover={{
                                                                    backgroundColor: 'rgba(250, 99, 0, 0.03)',
                                                                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                                                                }}
                                                                className={style.tableRow}
                                                            >
                                                                {/* Rank Cell */}
                                                                <td className={style.rankCell}>
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        className={`${style.rankBadge} ${team.ranking === 1
                                                                            ? style.goldRank
                                                                            : team.ranking === 2
                                                                                ? style.silverRank
                                                                                : team.ranking === 3
                                                                                    ? style.bronzeRank
                                                                                    : style.defaultRank
                                                                            }`}
                                                                    >
                                                                        {team.ranking === 1 && <Crown size={16} weight="fill" />}
                                                                        {team.ranking === 2 && <Medal size={16} weight="fill" />}
                                                                        {team.ranking === 3 && <FaAward size={16} />}
                                                                        <span>{team.ranking}</span>
                                                                    </motion.button>
                                                                </td>

                                                                {/* Team Cell */}
                                                                <td className={style.teamCell}>
                                                                    <div className={style.teamContent}>
                                                                        <motion.button
                                                                            whileTap={{ scale: 0.9 }}
                                                                            onClick={() => toggleTeamParticipants(team.id)}
                                                                            className={style.expandButton}
                                                                            aria-label={expandedTeamId === team.id ? "Collapse" : "Expand"}
                                                                        >
                                                                            <motion.div
                                                                                animate={{ rotate: expandedTeamId === team.id ? 180 : 0 }}
                                                                                transition={{ duration: 0.3 }}
                                                                            >
                                                                                <FiChevronDown />
                                                                            </motion.div>
                                                                        </motion.button>
                                                                        <span className={style.teamName}>{team.teamName}</span>
                                                                    </div>
                                                                </td>

                                                                {/* University Cell */}
                                                                <td className={style.universityCell}>
                                                                    <div className={style.universityContent}>
                                                                        <div className={style.universityLogo}>
                                                                            <img src={logo} alt="University" />
                                                                        </div>
                                                                        <span>{team.universityName}</span>
                                                                    </div>
                                                                </td>

                                                                {/* Coach Cell */}
                                                                <td className={style.coachCell}>
                                                                    <div className={style.coachContent}>
                                                                        <div className={style.coachAvatar}>
                                                                            <span>{team.coachName?.charAt(0) || 'C'}</span>
                                                                        </div>
                                                                        <span>{team.coachName || 'No Coach'}</span>
                                                                    </div>
                                                                </td>

                                                                {/* Actions Cell */}
                                                                {isCurrentSubAdminOfUniversity() && (
                                                                    <td className={style.actionsCell}>
                                                                        <div className={style.actionsContent}>
                                                                            <Button
                                                                                onClick={() => toggleUpdateTeamModal(team)}
                                                                                className={style.editBtn}
                                                                            >
                                                                                <FiEdit size={16} />
                                                                            </Button>
                                                                            <Button
                                                                                onClick={() => toggleDeleteTeamModal(team)}
                                                                                className={style.deleteBtn}
                                                                            >
                                                                                <FiTrash2 size={16} />
                                                                            </Button>
                                                                        </div>
                                                                    </td>
                                                                )}
                                                            </motion.tr>

                                                            {/* Expanded Participants Section */}
                                                            {expandedTeamId === team.id && (
                                                                <motion.tr
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: 'auto' }}
                                                                    exit={{ opacity: 0, height: 0 }}
                                                                    transition={{ duration: 0.4 }}
                                                                    className={style.participantsRow}
                                                                >
                                                                    <td colSpan={isCurrentSubAdminOfUniversity() ? 5 : 4}>
                                                                        <motion.div
                                                                            initial={{ opacity: 0 }}
                                                                            animate={{ opacity: 1 }}
                                                                            transition={{ delay: 0.2 }}
                                                                            className={style.participantsContainer}
                                                                        >
                                                                            <div className="d-flex justify-content-between">
                                                                                <div className={style.participantsHeader}>
                                                                                    <h5>Team Members</h5>
                                                                                    <span className={style.membersCount}>
                                                                                        {team.participants?.length || 0} members
                                                                                    </span>
                                                                                </div>
                                                                                {isCurrentSubAdminOfUniversity() && (
                                                                                    <Button
                                                                                        onClick={() => toggleAddParticipantModal(team)}
                                                                                        className={style.addParticipantBtn}
                                                                                    >
                                                                                        <FiPlus size={16} /> Add Participant
                                                                                    </Button>
                                                                                )}
                                                                            </div>

                                                                            <div className={style.participantsGrid}>
                                                                                {team.participants?.length > 0 ? (
                                                                                    team.participants.map((participant, pIndex) => (
                                                                                        <motion.div
                                                                                            key={participant?.participantId}
                                                                                            initial={{ opacity: 0, y: 10 }}
                                                                                            animate={{ opacity: 1, y: 0 }}
                                                                                            transition={{ delay: 0.05 * pIndex }}
                                                                                            className={style.participantCard}
                                                                                            whileHover={{
                                                                                                y: -3,
                                                                                                boxShadow: "0 6px 20px rgba(250, 99, 0, 0.15)"
                                                                                            }}
                                                                                        >
                                                                                            <div className={style.participantAvatar}>
                                                                                                <span>{participant?.participantName?.charAt(0) || 'P'}</span>
                                                                                            </div>
                                                                                            <div className={style.participantInfo}>
                                                                                                <h6>{participant.participantName}</h6>
                                                                                                <p>{participant?.participantEmail || 'No email'}</p>
                                                                                                <div className={style.participantMeta}>
                                                                                                    <span>{team.universityName}</span>
                                                                                                </div>
                                                                                            </div>
                                                                                            {isCurrentSubAdminOfUniversity() && (
                                                                                                <div className={style.participantControls}>
                                                                                                    <Button
                                                                                                        onClick={() => toggleDeleteParticipantModal(participant, team)}
                                                                                                        className={style.deleteBtn}
                                                                                                    >
                                                                                                        <FiTrash2 size={16} />
                                                                                                    </Button>
                                                                                                </div>
                                                                                            )}
                                                                                        </motion.div>
                                                                                    ))
                                                                                ) : (
                                                                                    <p className={style.noParticipants}>No participants found for this team</p>
                                                                                )}
                                                                            </div>
                                                                        </motion.div>
                                                                    </td>
                                                                </motion.tr>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </tbody>
                                            </motion.table>
                                        </div>
                                    </div>
                                </>)}

                            </motion.div>
                        </>)}
                    {/* Questions Section */}
                    {isCurrentSubAdminOfUniversity() && (!(competition?.qusetionPDF)) && (
                        <div className={style.sectionAdminControls}>
                            <Button
                                onClick={toggleUpdateQuestionsPDFModal}
                                className={style.addBtn}
                            >
                                <FiPlus size={18} /> Add Questions PDF
                            </Button>
                        </div>
                    )}

                    {competition?.qusetionPDF &&
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.4 }}
                            className="row justify-content-center"
                        >
                            <div className={`${style.PCPCQuestions} col`}>
                                <h2>Competition questions</h2>
                                {isCurrentSubAdminOfUniversity() && (
                                    <div className={`${style.sectionAdminControls} ${style.editCompQ}`}>
                                        <Button
                                            onClick={toggleUpdateQuestionsPDFModal}
                                            className={style.editBtn}
                                        >
                                            <FiEdit size={18} /> Edit Questions
                                        </Button>
                                    </div>
                                )}
                                <div className={style.questionsContent}>
                                    <div className={style.imageWrapper}>
                                        <motion.img
                                            whileHover={{ scale: 1.05 }}
                                            src={competition?.imageForQuestionsPDF || questions}
                                            alt="Questions"
                                            className={style.questionImage}
                                        />
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={style.download}
                                    >
                                        <div className={style.downloadContent}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path fill="#ffffff" d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                                            </svg>
                                            <a href={competition?.qusetionPDF}>
                                                <span>Download</span>
                                            </a>
                                        </div>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    }
                </div>
            }

            {/* Modals */}

            <UpdateInvitation
                show={showUpdateInvitationModal}
                onHide={toggleUpdateInvitationModal}
                competition={competition}
                onSuccess={() => handleCompetitionAction(() => getCompetition(competitionId))}
            />


            <AddImages
                show={showAddImageModal}
                onHide={toggleAddImageModal}
                competitionId={competitionId}
                onSuccess={() => handleCompetitionAction(() => getCompetition(competitionId))}

            />

            <DeleteImages
                show={showDeleteImageModal}
                onHide={toggleDeleteImageModal}
                competitionId={competitionId}
                imageId={selectedImageId}
                onSuccess={() => handleCompetitionAction(() => getCompetition(competitionId))}
            />

            <AddTeam
                show={showAddTeamModal}
                onHide={toggleAddTeamModal}
                competitionId={competitionId}
                onSuccess={() => handleCompetitionAction(() => getCompetition(competitionId))}
            />

            <DeleteTeam
                show={showDeleteTeamModal}
                onHide={toggleDeleteTeamModal}
                competitionId={competitionId}
                team={selectedTeam}
                onSuccess={() => handleCompetitionAction(() => getCompetition(competitionId))}
            />

            <AddParticipant
                show={showAddParticipantModal}
                onHide={toggleAddParticipantModal}
                team={selectedTeam}
                onSuccess={() => handleCompetitionAction(() => getCompetition(competitionId))}
            />

            <DeleteParticipant
                show={showDeleteParticipantModal}
                onHide={toggleDeleteParticipantModal}
                team={selectedTeam}
                participant={selectedParticipant}
                onSuccess={() => handleCompetitionAction(() => getCompetition(competitionId))}
            />

            <UpdateTeam
                show={showUpdateTeamModal}
                onHide={toggleUpdateTeamModal}
                competitionId={competitionId}
                team={selectedTeam}
                onSuccess={() => handleCompetitionAction(() => getCompetition(competitionId))}
            />

            <UpdateDescription
                show={showUpdateDescriptionModal}
                onHide={toggleUpdateDescriptionModal}
                competitionId={competitionId}
                description={competition.description}
                onSuccess={() => handleCompetitionAction(() => getCompetition(competitionId))}
            />

            <AddQuestionsPDF
                show={showUpdateQuestionsPDFModal}
                onHide={toggleUpdateQuestionsPDFModal}
                competitionId={competitionId}
                onSuccess={() => handleCompetitionAction(() => getCompetition(competitionId))}
            />

            <AddOrUpdateQuestionsPdf
                show={showUpdateQuestionsPDFModal}
                onHide={toggleUpdateQuestionsPDFModal}
                competition={competition}
                onSuccess={() => handleCompetitionAction(() => getCompetition(competitionId))}
            />
        </motion.div>
    );
}