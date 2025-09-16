import { lazy, Suspense } from "react";
import { observer } from "mobx-react";
import { Routes, Route,useLocation } from 'react-router-dom';
import ProtectedRoute from "./components/protected/ProtectedRoute";
import NotFound from "./components/notFound/NotFound";
import { useTranslation } from 'react-i18next';
const Login = lazy(() => import("./components/login/Login"));
const Home = lazy(() => import("./components/home/Home"));
const RoleError = lazy(() => import("./components/roleError/RoleError"));

const App = observer(() => {
  const { t } = useTranslation();
  const location = useLocation()

  return (
    <Suspense fallback={<div className="flex justify-center mt-3 font-bold text-4xl">{t("protectedRoute.loading")}</div>}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login/>}/>
        <Route path="/home" element={<ProtectedRoute><Home/> </ProtectedRoute> }/>
        <Route path="/roleError" element={<ProtectedRoute> <RoleError/> </ProtectedRoute>}/>
        <Route path="*" element={<NotFound />} />    
      </Routes>
    </Suspense>
  );
});

export default App;
