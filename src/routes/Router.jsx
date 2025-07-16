import { createBrowserRouter } from "react-router-dom";

import Root from "../Root/Root";
import { Signup } from "../pages/User/Auth/Signup/Signup";
import { ForgetPassword } from "../pages/User/Auth/ForgetPassword/ForgetPassword";
import { ResetPassword } from "../pages/User/Auth/ResetPassword/ResetPassword";
import { Profile } from "../pages/User/Profile/Profile";
import { Signin } from "../pages/User/Auth/Signin/Signin";
import DashBoard from "../components/Dashboard/DashBoard/DashBoard";
import AddSubAdmin from "../pages/Admin/AddSubAdmin/AddSubAdmin";
import AddUniversity from "../pages/Admin/AddUniversity/AddUniversity";
import FAQAdmin from "../pages/Admin/FAQAdmin/FAQAdmin";
import UpdateFAQ from "../pages/Admin/FAQAdmin/UpdateFAQ";
import ListSubAdmin from "../pages/Admin/ListSubAdmin/ListSubAdmin";
import UpdateUniversity from "../pages/Admin/ListUniversity/UpdateUniversity";
import ListUniversity from "../pages/Admin/ListUniversity/ListUniversity";
import ManageExperirnces from "../pages/Admin/ManageExperinces/ManageExperinces";
import DashBoardSubAdmin from "../components/Dashboard/DashBoardSubAdmin/DashBoardSubAdmin";
import AddImages from "../pages/Admin/AddUniversity/AddImages";
import { ViewDetailsUniversity } from "../pages/Admin/ListUniversity/ViewDetailsUniversity";
import ViewDetailsArchiveUniversity from "../pages/Admin/ListUniversity/ViewDetailsArchiveUniversity";
import ManageHome from "../pages/Admin/ManageHome/ManageHome";
import ViewProfileSubAdmin from "../pages/Admin/ViewProfileAdivster/ViewProfileSubAdmin";
import ManageArchive from "../pages/Admin/ManageArchive/ManageArchive";
import HomeDashBoard from "../pages/Admin/HomeDashBoard/HomeDashBoard";
import Home from "../pages/User/Home/Home";
import PageAllUniversity from "../pages/User/PageAllUniversity/PageAllUniversity"
import SingleUniversity from "../pages/User/SinglePageUniversity/SinglePageUniveristy";
import SinglePageExperincse from "../pages/User/SinglePersonalExp/SinglePageExperincse";
import EditHeroDashBaord from "../pages/Admin/HomeDashBoard/HeroDashBorad/EditHeroDashBaord";
import AddImagesHome from "../pages/Admin/HomeDashBoard/HeroDashBorad/AddImagesHome";
import Community from "../pages/User/Community/Community";
import Post from "../pages/User/Post/Post";
import PublicArchive from "../pages/User/PCPCArchive/PublicArchive/PublicArchive";
import InsideArchive from "../pages/User/PCPCArchive/InsideArchive/InsideArchive";
import UniversitiesArchive from "../pages/User/UnivercitiesArchive/UniversitiesArchive/UniversitiesArchive";
import UniversityInsideArchive from "../pages/User/UnivercitiesArchive/UniversityInsideArchive/UniversityInsideArchive";
import FAQ from "../pages/User/Home/FAQ/FAQ";
import ContactUs from "../pages/User/Home/ContactUs/ContactUs";
import AddImagesAbout from "../pages/User/SinglePageUniversity/AboutUniversity/AddImagesAbout";
import Rules from "../pages/User/Rules/Rules";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: '/university', element: <PageAllUniversity /> },
      { path: 'singleuniversity/:id', element: <SingleUniversity /> },
      { path: 'singlepageexperincse', element: <SinglePageExperincse /> },
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/forgetpassword",
        element: <ForgetPassword />,
      },
      {
        path: "/resetpassword",
        element: <ResetPassword />,
      },
      {
        path: '/profile/:id?',
        element: <Profile />,
      },
      {
        path: '/community',
        element: <Community />
      },
      {
        path: "/post/:id",
        element: <Post />
      },
      {
        path: '/publicarchive',
        element: <PublicArchive />
      },
      {
        path: '/competition/:id',
        element: <InsideArchive />
      },
      {
        path: "/universitycompetitions/:id",
        element: <UniversitiesArchive />
      },
      {
        path: "/universitycompetition/:competitionId",
        element: <UniversityInsideArchive />
      },
      {
        path: "/",
        element: <Home />,
      }, {
        path: "/contact",
        element: <ContactUs />,
      },
      { path: "edituniversity/:id", element: <UpdateUniversity /> },
      { path: "add-university-image/:id", element: <AddImagesAbout /> },
      {
        path: "/rules",
        element: <Rules/>,
      }
    ],
  },
  {
    path: "/dashboard",
    element: <DashBoard />,
    children: [
      { index: true, element: <HomeDashBoard /> },
      { path: "addsubadmin", element: <AddSubAdmin /> },
      { path: "adduniversity", element: <AddUniversity /> },
      { path: "faq", element: <FAQAdmin /> },
      { path: "edit-faq", element: <UpdateFAQ /> },
      { path: "listadv", element: <ListSubAdmin /> },

      { path: "listuniversity", element: <ListUniversity /> },
      { path: "manageexperinces", element: <ManageExperirnces /> },
      { path: "addimages/:id", element: <AddImages /> },
      { path: "viewdetailsuniversity/:id", element: <ViewDetailsUniversity /> },
      { path: "viewdetailsarchiveuniversity/:id", element: <ViewDetailsArchiveUniversity /> },
      { path: "managehome", element: <ManageHome /> },
      { path: "viewprofile/:id", element: <ViewProfileSubAdmin /> },
      { path: "managearchive", element: <ManageArchive /> },
      { path: "editherodashbaord", element: <EditHeroDashBaord /> },
      { path: "addimageshome", element: <AddImagesHome /> },
    ],
  },
  {
    path: "/dashboardsubadmin",
    element: <DashBoardSubAdmin />,
    children: [],
  },
]);

export default router;
