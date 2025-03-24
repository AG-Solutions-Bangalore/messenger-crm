import {   Route, Routes } from "react-router-dom";




import AuthRoute from "./AuthRoute";
import Login from "@/app/auth/Login";
import ForgotPassword from "@/components/ForgotPassword/ForgotPassword";
import Maintenance from "@/components/common/Maintenance";
import ProtectedRoute from "./ProtectedRoute";


import NotFound from "@/app/errors/NotFound";
import Home from "@/app/home/Home";
import UserList from "@/app/enquiry/user/UserList";
import PendingList from "@/app/enquiry/pending/PendingList";
import CancelList from "@/app/enquiry/cancel/CancelList";
import CompanyUserView from "@/app/companyList/companyUserView/CompanyUserView";
import CompanyListSuper from "@/app/companyList/companyListSuper/CompanyListSuper";
import CompanyStatusList from "@/app/companyStatus/CompanyStatusList";
import UploadDataList from "@/app/uploadData/UploadDataList";
import CompanySuperView from "@/app/companyList/companyListSuper/CompanySuperView";
import SignUp from "@/app/auth/SignUp";

function AppRoutes() {
  return (

      <Routes>
        <Route path="/" element={<AuthRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/maintenance" element={<Maintenance />} />
        </Route>

        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          {/* enquiry list  */}
          <Route path="/enquiry/pending" element={<PendingList />} />
          <Route path="/enquiry/cancel" element={<CancelList />} />
          <Route path="/enquiry/user" element={<UserList />} />

          {/* company list super  */}
          <Route path="/company-list" element={<CompanyListSuper />} />
          <Route path="/company-list/view/:id" element={<CompanySuperView />} />

        {/* company list user  */}
          <Route path="/company-list-user" element={<CompanyUserView />} />
          {/* company status  */}
          <Route path="/company-status" element={<CompanyStatusList />} />
          {/* upload data  */}
          <Route path="/upload-data" element={<UploadDataList />} />
          
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    
  );
}

export default AppRoutes;