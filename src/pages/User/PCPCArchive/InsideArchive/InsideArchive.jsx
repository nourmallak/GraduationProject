import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FiSearch, FiChevronDown, FiEdit, FiTrash2, FiPlus, FiYoutube } from 'react-icons/fi';
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
import invitation from "../../../../images/insidaArchive/invitation.png";
import questions from '../../../../images/insidaArchive/questions.png';
import style from "../InsideArchive/InsideArchive.module.css";
import logo from '../../../../images/logo/logo.png'
import { useParams } from "react-router-dom";
import AddLocations from "../../../../components/ArchiveControls/AddLocations/AddLocations";
import AddImages from "../../../../components/ArchiveControls/AddImages/AddImages";
import DeleteImages from "../../../../components/ArchiveControls/DeleteImages/DeleteImage";
import DeleteLocation from "../../../../components/ArchiveControls/DeleteLocation/DeleteLocation";
import DeleteSponsor from "../../../../components/ArchiveControls/DeleteSponsor/DeleteSponsor";
import UpdateSponsor from "../../../../components/ArchiveControls/UpdateSponsor/UpdateSponsor";
import AddSponsor from "../../../../components/ArchiveControls/AddSponsor/AddSponsor";
import AddTeam from "../../../../components/ArchiveControls/AddTeam/AddTeam";
import DeleteTeam from "../../../../components/ArchiveControls/DeleteTeam/DeleteTeam";
import AddParticipant from "../../../../components/ArchiveControls/AddParticipant/AddParticipant";
import DeleteParticipant from "../../../../components/ArchiveControls/DeleteParticipant/DeleteParticipant";
import UpdateTeam from "../../../../components/ArchiveControls/UpdateTeam/UpdateTeam";
import UpdateDescription from "../../../../components/ArchiveControls/UpdateDescription/UpdateDescription";
import SponsorDescription from "../../../../components/ArchiveControls/SponsorDescription/SponsorDescription";
import { UserContext } from "../../../../context/Context";
import Loader from "../../../../Loader/Loader";
import UpdateInvitation from "../../../../components/ArchiveControls/UpdateInvitation/UpdateInvitation";
import AddOrUpdateQuestionsPdf from "../../../../components/ArchiveControls/UpdateQuestionsPDF/UpdateQuestionsPDF";
import UpdateScoreboard from "../../../../components/ArchiveControls/UpdateScoreboard/UpdateScoreboard";
import AddScoreboard from "../../../../components/ArchiveControls/AddScoreboard/AddScoreboard";
import DeleteScoreboard from "../../../../components/ArchiveControls/DeleteScoreboard/DeleteScoreboard";
import DeleteInvitation from "../../../../components/ArchiveControls/DeleteInvitation/DeleteInvitation";
import DeleteDescription from "../../../../components/ArchiveControls/DeleteDescription/DeleteDescription";
import DeleteCompetitionVideo from "../../../../components/ArchiveControls/DeleteCompetitionVideo/DeleteCompetitionVideo";
import UpdateVideoLink from "../../../../components/ArchiveControls/UpdateVideoLink/UpdateVideoLink";
import AddVideoLink from "../../../../components/ArchiveControls/AddVideoLink/AddVideoLink";

export default function InsideArchive() {
  const [competition, setCompetition] = useState({});
  const [locations, setLocations] = useState([]);
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const token = localStorage.getItem("user token");
  const role = localStorage.getItem('userRole');
  const [isAdmin, setIsAdmin] = useState(token && role === 'Admin');
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [selectedSponsorId, setSelectedSponsorId] = useState(null);
  const [showSponsorDescriptionModal, setShowSponsorDescriptionModal] = useState(false);
  const [selectedSponsorDescription, setSelectedSponsorDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const { id } = useParams();

  const {
    showUpdateCompetitionModal, setShowUpdateCompetitionModal,
    showAddImageModal, setShowAddImageModal,
    showDeleteImageModal, setShowDeleteImageModal,
    showDeleteLocationModal, setShowDeleteLocationModal,
    showAddSponsorModal, setShowAddSponsorModal,
    showDeleteSponsorModal, setShowDeleteSponsorModal,
    showUpdateSponsorModal, setShowUpdateSponsorModal,
    showAddTeamModal, setShowAddTeamModal,
    showDeleteTeamModal, setShowDeleteTeamModal,
    showUpdateTeamModal, setShowUpdateTeamModal,
    showAddParticipantModal, setShowAddParticipantModal,
    showDeleteParticipantModal, setShowDeleteParticipantModal,
    showUpdateDescriptionModal, setShowUpdateDescriptionModal,
    showAddLocationModal, setShowAddLocationModal,
    showUpdateQuestionsPDFModal, setShowUpdateQuestionsPDFModal,
    showUpdateInvitationModal, setShowUpdateInvitationModal,
    showUpdateScoreboardModal, setShowUpdateScoreboardModal,
    showAddScoreboardModal, setShowAddScoreboardModal,
    showDeleteInvitationModal, setShowDeleteInvitation,
    showDeleteScoreboardModal, setShowDeleteScoreboardModal,
    showDeleteDescriptionModal, setShowDeleteDescriptionModal,
    showDeleteVideoModal, setShowDeleteVideoModal,
    showAddVideoModal, setShowAddVideoModal,
    showUpdateVideoModal, setShowUpdateVideoModal
  } = useContext(UserContext);

  async function getCompetition() {
    try {
      const data = await axios.get(`${import.meta.env.VITE_API}/Compitions/GetCompetitionDetails/${id}`);
      setCompetition(data.data);
    } catch (error) {
      console.error("Failed to fetch competitions:", error);
    }
  }

  async function getLocations() {
    try {
      const LocationsData = await axios.get(`${import.meta.env.VITE_API}/Location/competitions/${id}/locations`) || '';
      setLocations(LocationsData?.data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  }

  const toggleAddImageModal = () => setShowAddImageModal(!showAddImageModal);
  const toggleAddLocationModal = () => setShowAddLocationModal(!showAddLocationModal);
  const toggleDeleteImageModal = (id) => {
    setSelectedImageId(id);
    setShowDeleteImageModal(!showDeleteImageModal);
  };
  const toggleDeleteLocationModal = (id) => {
    setSelectedLocation(id);
    setShowDeleteLocationModal(!showDeleteLocationModal);
  };
  const toggleAddSponsorModal = () => setShowAddSponsorModal(!showAddSponsorModal);
  const toggleDeleteSponsorModal = (sponsorId) => {
    setSelectedSponsorId(sponsorId);
    setShowDeleteSponsorModal(!showDeleteSponsorModal);
  };
  const toggleUpdateSponsorModal = (sponsor) => {
    setSelectedSponsor(sponsor);
    setShowUpdateSponsorModal(!showUpdateSponsorModal);
  };
  const toggleUpdateQuestionsPDFModal = () => {
    setShowUpdateQuestionsPDFModal(!showUpdateQuestionsPDFModal);
  };
  const toggleUpdateInvitationModal = () => {
    setShowUpdateInvitationModal(!showUpdateInvitationModal);
  };
  const toggleSponsorDescriptionModal = (description = '') => {
    setSelectedSponsorDescription(description);
    setShowSponsorDescriptionModal(!showSponsorDescriptionModal);
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

  const toggleUpdateScoreboardModal = () => {
    setShowUpdateScoreboardModal(!showUpdateScoreboardModal);
  };

  const toggleAddScoreboardModal = () => {
    setShowAddScoreboardModal(!showAddScoreboardModal);
  };

  const toggleUpdateVideoModal = () => {
    setShowUpdateVideoModal(!showUpdateVideoModal);
  };

  const toggleAddVideoModal = () => {
    setShowAddVideoModal(!showAddVideoModal);
  };

  const toggleDeleteScoreboardModal = () => {
    setShowDeleteScoreboardModal(!showDeleteScoreboardModal);
  };

  const toggleDeleteInvitationModal = () => {
    setShowDeleteInvitation(!showDeleteInvitationModal);
  };

  const toggleDeleteDescriptionModal = () => {
    setShowDeleteDescriptionModal(!showDeleteDescriptionModal);
  };

  const toggleDeleteVideoModal = () => {
    setShowDeleteVideoModal(!showDeleteVideoModal);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/Teams/Get-Teams-By-ParticipantName-And-Competition?participantName=${searchTerm}&competitionId=${id}`
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
      await getCompetition(id);
      await getLocations(id);
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getCompetition(id);
    const delay = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    getLocations(id);
  }, []);

  return (
    <div className={`${style.body} ${style.fadeIn}`}>
      {loading ? <Loader /> :
        <div className="container">
          {/* Title Section */}
          <h1 className={`${style.title} ${style.slideDown}`}>
            {competition.name}

          </h1>

          {/* Invitation Section */}
          {isAdmin && (
            <div className={style.sectionAdminControls}>
              {competition?.image2 ? (
                <div className={style.sponsorControls}>
                  <Button
                    onClick={toggleUpdateInvitationModal}
                    className={style.editBtn}
                  >
                    <FiEdit size={18} />
                  </Button>
                  <Button
                    onClick={toggleDeleteInvitationModal}
                    className={style.deleteBtn}
                  >
                    <FiTrash2 size={18} />
                  </Button>
                </div>
              ) : (
                <Button onClick={toggleUpdateInvitationModal} className={style.addBtn}>
                  <FiPlus size={18} /> Add Invitation
                </Button>
              )}
            </div>
          )}
          {competition?.image2 &&
            <div className={`${style.firstSection} ${style.slideUp}`}>
              <img className={style.invitation} src={competition?.image2} alt="Invitation" />
            </div>
          }


          {/* Images Carousel */}
          {isAdmin && (
            <div className={style.sectionAdminControls}>
              <Button onClick={toggleAddImageModal} className={style.addBtn}>
                <FiPlus size={18} /> Add Image
              </Button>
            </div>
          )}

          {competition?.images?.length > 0 && (
            <div className={`${style.carouselContainer} ${style.fadeIn}`}>
              <Swiper
                effect="coverflow"
                grabCursor={true}
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
                    {isAdmin && (
                      <div className={style.imageControls}>
                        <Button
                          onClick={() => toggleDeleteImageModal(image.competitionImagesId)}
                          className={style.deleteBtn}
                        >
                          <FiTrash2 size={16} />
                        </Button>
                      </div>
                    )}
                    <img className={style.hoverScale} src={image.imageName} alt={`Image ${index + 1}`} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {/* Video section */}

          {competition?.videoLink ? (
            <>
              {isAdmin && (
                <div className={style.sectionAdminControls}>
                  <div className={style.sponsorControls}>
                    <Button
                      onClick={toggleUpdateVideoModal}
                      className={style.editBtn}
                    >
                      <FiEdit size={18} />
                    </Button>
                    <Button
                      onClick={toggleDeleteVideoModal}
                      className={style.deleteBtn}
                    >
                      <FiTrash2 size={18} />
                    </Button>
                  </div>
                </div>
              )}
              <div className={`${style.videoSection} ${style.fadeIn}`}>
                <a target="_blank"
                  rel="noopener noreferrer"
                  className={style.videoLink}
                  href={competition?.videoLink}
                >
                  <FiYoutube size={24} className={style.youtubeIcon} />
                  <span>Watch Competition Moments</span>
                </a>
              </div>
            </>
          ) :
            <>
              {isAdmin && (
                <div className={style.sectionAdminControls}>
                  <Button onClick={toggleAddVideoModal} className={style.addBtn}>
                    <FiPlus size={18} /> Add Video
                  </Button>
                </div>
              )}
            </>
          }

          {/* Description Section */}
          {isAdmin && (!(competition?.description)) && (
            <div className={style.sectionAdminControls}>
              <Button onClick={toggleUpdateDescriptionModal} className={style.addBtn}>
                <FiPlus size={18} /> Add Description
              </Button>
            </div>
          )}

          <div className={`${style.descriptionContainer} ${style.fadeIn}`}>
            {competition?.description &&
              <>{isAdmin && (
                <div className={style.sectionAdminControls}>
                  <div className={style.sponsorControls}>
                    <Button
                      onClick={toggleUpdateDescriptionModal}
                      className={style.editBtn}
                    >
                      <FiEdit size={18} />
                    </Button>
                    <Button
                      onClick={toggleDeleteDescriptionModal}
                      className={style.deleteBtn}
                    >
                      <FiTrash2 size={18} />
                    </Button>
                  </div>
                </div>
              )}</>
            }
            <p className={style.description}>
              {competition?.description}
            </p>
          </div>

          {/* Locations Section */}
          {isAdmin && (locations?.length == 0) && (
            <div className={style.sectionAdminControls}>
              <Button
                onClick={() => toggleAddLocationModal()}
                className={style.addBtn}
              >
                <FiPlus size={18} /> Add Location
              </Button>
            </div>
          )}
          {locations?.length > 0 && (
            <div className={`${style.locationsContainer} ${style.fadeIn}`}>
              {isAdmin && (
                <div className={style.sectionAdminControls}>
                  <Button onClick={toggleAddLocationModal} className={style.addBtn}>
                    <FiPlus size={18} /> Add Location
                  </Button>
                </div>
              )}

              <ul className={`${style.list} row d-flex justify-content-center`}>
                {locations?.map((location, index) => (
                  <li key={location?.id} className="col-lg-3 d-flex align-items-center gap-1">
                    {isAdmin && (
                      <Button
                        onClick={() => toggleDeleteLocationModal(location?.id)}
                        className={style.deleteBtn}
                      >
                        <FiTrash2 size={14} />
                      </Button>
                    )}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                      <path fill="#fa6300" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                    </svg>
                    <span>{location?.name}</span>
                  </li>
                ))}
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
            </div>
          )}

          {/* Sponsors Section */}
          <div className={`${style.sponsors} ${style.fadeIn}`}>
            <div className={style.sponsorsHeader}>
            </div>
            <div className={style.addSponsor}>
              {isAdmin && (competition?.sponsors?.length == 0) && (
                <Button onClick={toggleAddSponsorModal} className={style.addBtn}>
                  <FiPlus size={18} /> Add Sponsor
                </Button>
              )}
            </div>
          </div>

          {(competition?.sponsors?.length > 0) && (
            <>
              <div className={`${style.sponsors} ${style.fadeIn}`}>
                <div className={style.sponsorsHeader}>
                  <h2>Sponsored by</h2>
                </div>
                <div className={`${style.addSponsor}`}>
                  {isAdmin && (
                    <Button onClick={toggleAddSponsorModal} className={`${style.addBtn}`}>
                      <FiPlus size={18} /> Add Sponsor
                    </Button>
                  )}
                </div>
              </div>
              <div className={`${style.sponsors} ${style.fadeIn}`}>
                <div className="row">
                  {competition.sponsors.map((sponsor, index) => (
                    <div key={sponsor.sponsorId} className={`${style.sponsor} col`}>
                      <img src={sponsor.logo} alt={sponsor.name} className={`${style.sponsorImg} mb-3`} />
                      <h5 className="text-center mb-5">{sponsor.name}</h5>

                      <ul className={style.list}>
                        {sponsor?.description && (
                          <li>
                            <Button
                              onClick={() => toggleSponsorDescriptionModal(sponsor.description)}
                              className={style.descriptionBtn}
                              aria-label="View description"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16">
                                <path fill="#fa6300" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                              </svg>
                            </Button>
                          </li>
                        )}

                        {sponsor?.gmail && (
                          <li>
                            <a href={`mailto:${sponsor.gmail}`} aria-label="Email sponsor">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16">
                                <path fill="#fa6300" d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                              </svg>
                            </a>
                          </li>
                        )}

                        {sponsor?.website && (
                          <li>
                            <a href={sponsor.website} target="_blank" rel="noopener noreferrer" aria-label="Visit website">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="16" height="16">
                                <path fill="#fa6300" d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
                              </svg>
                            </a>
                          </li>
                        )}

                        {sponsor?.facelink && (
                          <li>
                            <a href={sponsor?.facelink} target="_blank" rel="noopener noreferrer" aria-label="Facebook page">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16">
                                <path fill="#fa6300" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64h98.2V334.2H109.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H255V480H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z" />
                              </svg>
                            </a>
                          </li>
                        )}

                        {sponsor?.instlink && (
                          <li>
                            <a href={sponsor?.instlink} target="_blank" rel="noopener noreferrer" aria-label="Instagram profile">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16">
                                <path fill="#fa6300" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                              </svg>
                            </a>
                          </li>
                        )}
                      </ul>
                      {isAdmin && (
                        <div className={style.sponsorControls}>
                          <Button
                            onClick={() => toggleUpdateSponsorModal(sponsor)}
                            className={style.editBtn}
                          >
                            <FiEdit size={14} />
                          </Button>
                          <Button
                            onClick={() => toggleDeleteSponsorModal(sponsor?.id)}
                            className={style.deleteBtn}
                          >
                            <FiTrash2 size={14} />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Scoreboard Section */}

          {isAdmin && (!(competition?.imageForScoreboard)) && (
            <div className={style.sectionAdminControls}>
              <Button onClick={toggleAddScoreboardModal} className={style.addBtn}>
                <FiPlus size={18} /> Add Scoreboard
              </Button>
            </div>
          )}

          {competition?.imageForScoreboard && (<div className={`${style.scoreboardSection} ${style.fadeIn}`}>
            <h2 className={style.sectionTitle}>Competition Scoreboard</h2>
            <div className={style.scoreboardContent}>
              {isAdmin && competition?.imageForScoreboard && (
                <div className={style.sectionAdminControls}>
                  {isAdmin && (
                    <div className={style.sponsorControls}>
                      <Button
                        onClick={toggleUpdateScoreboardModal}
                        className={style.editBtn}
                      >
                        <FiEdit size={18} />
                      </Button>
                      <Button
                        onClick={toggleDeleteScoreboardModal}
                        className={style.deleteBtn}
                      >
                        <FiTrash2 size={18} />
                      </Button>
                    </div>
                  )}

                </div>
              )}
              <img
                src={competition?.imageForScoreboard}
                alt="Scoreboard"
                className={style.scoreboardImage}
              />
            </div>
          </div>)}



          {/* Teams Section */}
          <div className="d-flex justify-content-end">
            {isAdmin && ((teamsToDisplay?.length === 0)) && (
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

          {(teamsToDisplay?.length > 0) && (
            <>
              <div className={`${style.teamsContainer} ${style.fadeIn}`}>
                {/* Header Section */}
                <div className={style.header}>
                  <h2 className={style.title}>
                    Teams
                    <span className={style.teamCount}>
                      {teamsToDisplay.length}
                    </span>
                  </h2>

                  <div className={style.searchWrapper}>
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
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path fill="#ffffff" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className={style.sectionAdminControls}>
                    <Button
                      onClick={toggleAddTeamModal}
                      className={style.addBtn}
                    >
                      <FiPlus size={18} /> Add Team
                    </Button>
                  </div>
                )}

                {teamsToDisplay?.length > 0 && (
                  <>
                    {/* Table Section */}
                    <div className={style.tableOuterContainer}>
                      <div className={style.tableBorder} />

                      <div className={style.tableInnerContainer}>
                        <table className={style.table}>
                          {/* Table Header */}
                          <thead>
                            <tr className={style.tableHeader}>
                              <th className={style.rankColumn}>Rank</th>
                              <th className={style.teamColumn}>Team</th>
                              <th className={style.universityColumn}>University</th>
                              <th className={style.coachColumn}>Coach</th>
                              {isAdmin && <th className={style.actionsColumn}>Actions</th>}
                            </tr>
                          </thead>

                          {/* Table Body */}
                          <tbody>
                            {teamsToDisplay.map((team, index) => (
                              <React.Fragment key={team.teamId}>
                                {/* Team Row */}
                                <tr className={`${style.tableRow} ${style.teamCard}`}>
                                  {/* Rank Cell */}
                                  <td className={style.rankCell}>
                                    <button
                                      className={`${style.rankBadge} ${team.ranking === 1
                                        ? style.goldRank
                                        : team.ranking === 2
                                          ? style.silverRank
                                          : team.ranking === 3
                                            ? style.bronzeRank
                                            : style.defaultRank
                                        } ${style.tapScale}`}
                                    >
                                      {team.ranking === 1 && <Crown size={16} weight="fill" />}
                                      {team.ranking === 2 && <Medal size={16} weight="fill" />}
                                      {team.ranking === 3 && <FaAward size={16} />}
                                      <span>{team.ranking}</span>
                                    </button>
                                  </td>

                                  {/* Team Cell */}
                                  <td className={style.teamCell}>
                                    <div className={style.teamContent}>
                                      <button
                                        onClick={() => toggleTeamParticipants(team.id)}
                                        className={`${style.expandButton} ${style.tapScale}`}
                                        aria-label={expandedTeamId === team.id ? "Collapse" : "Expand"}
                                      >
                                        <div className={`${style.chevron} ${expandedTeamId === team.id ? style.rotate : ''}`}>
                                          <FiChevronDown />
                                        </div>
                                      </button>
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
                                  {isAdmin && (
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
                                </tr>

                                {/* Expanded Participants Section */}
                                {expandedTeamId === team.id && (
                                  <tr className={style.participantsRow}>
                                    <td colSpan={isAdmin ? 5 : 4}>
                                      <div className={`${style.participantsContainer} ${style.expanded}`}>
                                        <div className="d-flex justify-content-between">
                                          <div className={style.participantsHeader}>
                                            <h5>Team Members</h5>
                                            <span className={style.membersCount}>
                                              {team.participants?.length || 0} members
                                            </span>
                                          </div>
                                          {isAdmin && (
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
                                              <div
                                                key={participant?.participantId}
                                                className={`${style.participantCard} ${style.fadeIn}`}
                                                style={{ animationDelay: `${pIndex * 0.05}s` }}
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
                                                {isAdmin && (
                                                  <div className={style.participantControls}>
                                                    <Button
                                                      onClick={() => toggleDeleteParticipantModal(participant, team)}
                                                      className={style.deleteBtn}
                                                    >
                                                      <FiTrash2 size={16} />
                                                    </Button>
                                                  </div>
                                                )}
                                              </div>
                                            ))
                                          ) : (
                                            <p className={style.noParticipants}>No participants found for this team</p>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Questions Section */}
          {isAdmin && (!(competition?.qusetionPDF)) && (
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
            <div className={`row justify-content-center ${style.fadeIn}`}>
              <div className={`${style.PCPCQuestions} col`}>
                <h2>Competition questions</h2>
                {isAdmin && (
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
                    <img
                      src={competition?.imageForQuestionsPDF}
                      alt="Questions"
                      className={`${style.questionImage} ${style.hoverScale}`}
                    />
                  </div>
                  <button className={`${style.download} ${style.tapScale}`}>
                    <div className={style.downloadContent}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="#ffffff" d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                      </svg>
                      <a href={competition?.qusetionPDF}>
                        <span>Download</span>
                      </a>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }

      {/* Modals */}
      <UpdateInvitation
        show={showUpdateInvitationModal}
        onHide={toggleUpdateInvitationModal}
        competition={competition}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <AddImages
        show={showAddImageModal}
        onHide={toggleAddImageModal}
        competitionId={id}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <AddLocations
        show={showAddLocationModal}
        onHide={toggleAddLocationModal}
        competitionId={id}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <DeleteImages
        show={showDeleteImageModal}
        onHide={toggleDeleteImageModal}
        competitionId={id}
        imageId={selectedImageId}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <DeleteLocation
        show={showDeleteLocationModal}
        onHide={toggleDeleteLocationModal}
        locationId={selectedLocation}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <DeleteSponsor
        show={showDeleteSponsorModal}
        onHide={toggleDeleteSponsorModal}
        competitionId={id}
        sponsorId={selectedSponsorId}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <UpdateSponsor
        show={showUpdateSponsorModal}
        onHide={toggleUpdateSponsorModal}
        sponsor={selectedSponsor}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <AddSponsor
        show={showAddSponsorModal}
        onHide={toggleAddSponsorModal}
        competitionId={id}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <AddTeam
        show={showAddTeamModal}
        onHide={toggleAddTeamModal}
        competitionId={id}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <DeleteTeam
        show={showDeleteTeamModal}
        onHide={toggleDeleteTeamModal}
        competitionId={id}
        team={selectedTeam}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <AddParticipant
        show={showAddParticipantModal}
        onHide={toggleAddParticipantModal}
        team={selectedTeam}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <DeleteParticipant
        show={showDeleteParticipantModal}
        onHide={toggleDeleteParticipantModal}
        team={selectedTeam}
        participant={selectedParticipant}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <UpdateTeam
        show={showUpdateTeamModal}
        onHide={toggleUpdateTeamModal}
        competitionId={id}
        team={selectedTeam}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <UpdateDescription
        show={showUpdateDescriptionModal}
        onHide={toggleUpdateDescriptionModal}
        competitionId={id}
        description={competition.description}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <SponsorDescription
        show={showSponsorDescriptionModal}
        onHide={() => toggleSponsorDescriptionModal()}
        description={selectedSponsorDescription}
      />

      <AddOrUpdateQuestionsPdf
        show={showUpdateQuestionsPDFModal}
        onHide={toggleUpdateQuestionsPDFModal}
        competition={competition}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <UpdateScoreboard
        show={showUpdateScoreboardModal}
        onHide={toggleUpdateScoreboardModal}
        competition={competition}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <AddScoreboard
        show={showAddScoreboardModal}
        onHide={toggleAddScoreboardModal}
        competition={competition}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <DeleteScoreboard
        show={showDeleteScoreboardModal}
        onHide={toggleDeleteScoreboardModal}
        competition={competition}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <DeleteInvitation
        show={showDeleteInvitationModal}
        onHide={toggleDeleteInvitationModal}
        competition={competition}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <DeleteDescription
        show={showDeleteDescriptionModal}
        onHide={toggleDeleteDescriptionModal}
        competition={competition}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <DeleteCompetitionVideo
        show={showDeleteVideoModal}
        onHide={toggleDeleteVideoModal}
        competition={competition}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <UpdateVideoLink
        show={showUpdateVideoModal}
        onHide={toggleUpdateVideoModal}
        competition={competition}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />

      <AddVideoLink
        show={showAddVideoModal}
        onHide={toggleAddVideoModal}
        competition={competition}
        onSuccess={() => handleCompetitionAction(() => getCompetition(id))}
      />
    </div>
  );
}