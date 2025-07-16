import React from "react";
import { useContext } from "react";
import { createContext, useEffect, useState } from "react";
export const UserContext = createContext();
export function useMyContext() {
    return useContext(UserContext);
}
export default function UserContextProvider({ children }) {

    const [isLogin, setIsLogin] = useState(localStorage.getItem("user token") ? true : false);
    const [userProfile, setUserProfile] = useState({});
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showCreatePersonalExperienceModal, setShowCreatePersonalExperienceModal] = useState(false);
    const [showUpdatePersonalExperienceModal, setShowUpdatePersonalExperienceModal] = useState(false);
    const [showDeletePersonalExperienceModal, setShowDeletePersonalExperienceModal] = useState(false);
    const [showAddPostModal, setShowAddPostModal] = useState(false);
    const [showDeletePostModal, setShowDeletePostModal] = useState(false);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [showAddImageModal, setShowAddImageModal] = useState(false);
    const [showDeleteImageModal, setShowDeleteImageModal] = useState(false);
    const [showUpdateLocationModal, setShowUpdateLocationModal] = useState(false);
    const [showDeleteLocationModal, setShowDeleteLocationModal] = useState(false);
    const [showAddSponsorModal, setShowAddSponsorModal] = useState(false);
    const [showDeleteSponsorModal, setShowDeleteSponsorModal] = useState(false);
    const [showUpdateSponsorModal, setShowUpdateSponsorModal] = useState(false);
    const [showAddTeamModal, setShowAddTeamModal] = useState(false);
    const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);
    const [showUpdateTeamModal, setShowUpdateTeamModal] = useState(false);
    const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
    const [showDeleteParticipantModal, setShowDeleteParticipantModal] = useState(false);
    const [showUpdateDescriptionModal, setShowUpdateDescriptionModal] = useState(false);
    const [showAddLocationModal, setShowAddLocationModal] = useState(false);
    const [showUpdateCompetitionModal, setShowUpdateCompetitionModal] = useState(false);
    const [showAddCompetitionModal, setShowAddCompetitionModal] = useState(false);
    const [showSponsorDescriptionModal, setShowSponsorDescriptionModal] = useState(false);
    const [showDeleteCommpetitionModal, setShowDeleteCommpetitionModal] = useState(false);
    const [showUpdateCommpetitionModal, setShowUpdateCommpetitionModal] = useState(false);
    const [showUpdateQuestionsPDFModal, setShowUpdateQuestionsPDFModal] = useState(false);
    const [showUpdateInvitationModal, setShowUpdateInvitationModal] = useState(false);
    const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
    const [showUpdateScoreboardModal, setShowUpdateScoreboardModal] = useState(false);
    const [showAddScoreboardModal, setShowAddScoreboardModal] = useState(false);
    const [showDeleteInvitationModal, setShowDeleteInvitation] = useState(false);
    const [showDeleteScoreboardModal, setShowDeleteScoreboardModal] = useState(false);
    const [showDeleteDescriptionModal, setShowDeleteDescriptionModal] = useState(false);
    const [showUpdateVideoModal, setShowUpdateVideoModal] = useState(false);
    const [showDeleteVideoModal, setShowDeleteVideoModal] = useState(false);
    const [showAddVideoModal, setShowAddVideoModal] = useState(false);
    const [showAddRuleModal, setShowAddRuleModal] = useState(false);
    const [showEditRuleModal, setShowEditRuleModal] = useState(false);
    const [showDeleteRuleModal, setShowDeleteRuleModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [universityInfo, setUniversityInfo] = useState(null);

    useEffect(() => {
    }, []);

    return (
        <UserContext.Provider
            value={{
                isLogin,
                setIsLogin,
                showEditProfile,
                setShowEditProfile,
                userProfile,
                setUserProfile,
                showCreatePersonalExperienceModal,
                setShowCreatePersonalExperienceModal,
                showUpdatePersonalExperienceModal,
                setShowUpdatePersonalExperienceModal,
                setShowDeletePersonalExperienceModal,
                showDeletePersonalExperienceModal,
                showAddPostModal,
                setShowAddPostModal,
                showDeletePostModal,
                setShowDeletePostModal,
                showCommentsModal,
                setShowCommentsModal,
                showLikesModal,
                setShowLikesModal,
                showAddImageModal, setShowAddImageModal,
                showDeleteImageModal, setShowDeleteImageModal,
                showUpdateLocationModal, setShowUpdateLocationModal,
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
                showUpdateCompetitionModal, setShowUpdateCompetitionModal,
                showAddCompetitionModal, setShowAddCompetitionModal,
                showSponsorDescriptionModal, setShowSponsorDescriptionModal,
                showDeleteCommpetitionModal, setShowDeleteCommpetitionModal,
                showUpdateCommpetitionModal, setShowUpdateCommpetitionModal,
                showUpdateQuestionsPDFModal, setShowUpdateQuestionsPDFModal,
                showUpdateInvitationModal, setShowUpdateInvitationModal,
                showDeleteCommentModal, setShowDeleteCommentModal,
                showUpdateScoreboardModal, setShowUpdateScoreboardModal,
                showAddScoreboardModal, setShowAddScoreboardModal,
                showDeleteInvitationModal, setShowDeleteInvitation,
                showDeleteScoreboardModal, setShowDeleteScoreboardModal,
                showDeleteDescriptionModal, setShowDeleteDescriptionModal,
                showDeleteVideoModal, setShowDeleteVideoModal,
                showAddVideoModal, setShowAddVideoModal,
                showUpdateVideoModal, setShowUpdateVideoModal,
                showAddRuleModal, setShowAddRuleModal,
                showEditRuleModal, setShowEditRuleModal,
                showDeleteRuleModal, setShowDeleteRuleModal,
                showPasswordModal, setShowPasswordModal,
                universityInfo, setUniversityInfo
            }}>
            {children}
        </UserContext.Provider>
    );
}