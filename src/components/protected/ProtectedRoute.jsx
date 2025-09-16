import React from 'react';
import { observer } from 'mobx-react';
import authStore from "../../stores/AuthStore";
import { Navigate} from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import { useTranslation } from 'react-i18next';

const ProtectedRoute = observer(({ children, permission = [] }) => {
   const { t } = useTranslation();
  if (authStore.Loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner aria-label={t("protectedRoute.loading")} size="xl" />
      </div>
    );
  }

  if (authStore.userPermissions && permission.length) {
    const ValidPermission = permission.some(element => authStore.userPermissions.includes(element));
    
    if (!ValidPermission) {
      return <Navigate to="/roleError" replace />;
    }
  }
  
  if (!authStore.token) {
    return(
      <Navigate to="/" />
    )
  }else{
    return(
      children
    )
  }
        
});

export default ProtectedRoute;