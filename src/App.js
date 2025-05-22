//import logo from './logo.svg';
//import './App.css';

//Importation des routes 
import { BrowserRouter as Router, Routes, Route, useLocation,Navigate } from "react-router-dom";  //localisation 

//Administration
import DashboardAdmin from "./pages/Admin/DashboardAdmin"
import DashboardGuide from "./pages/Guides/DashboardGuide"
import ConnexionAdmin from "./pages/Admin/ConnexionAdmin"
import ConnexionGuide from "./pages/Guides/ConnexionGuide"
import DetailTouriste from "./pages/Admin/DetailTouriste"
import DetailGuide from "./pages/Admin/DetailGuide"
import DetailVisite from "./pages/Admin/DetailVisite"
import DetailAdmin from "./pages/Admin/DetailAdmin"
import DetailFacture from "./pages/Admin/DetailFacture"
import CreationTouriste from "./pages/Admin/CreationTouriste"
import CreationAdmin from "./pages/Admin/CreationAdmin"
import CreationVisite from "./pages/Admin/CreationVisite"
import CreationGuide from "./pages/Admin/CreationGuide"
import ModifierTouriste from "./pages/Admin/ModifierTouriste"

import ModifierAdmin from "./pages/Admin/ModifierAdmin";
import ModifierGuide from "./pages/Admin/ModifierGuide";
import ModifierVisite from "./pages/Admin/ModifierVisite";
import ReservationListe from "./pages/Admin/ReservationListe";



//services ---type zones

//Confirmation
import Confirmation from "./pages/Confirmation";


//les pages
import Dashboard from "./pages/dashboard"

import Home from "./pages/Home"

import Connexion from "./pages/Authentification/Connexion";
import Inscription from "./pages/Authentification/Inscription";
import ProfileUser from "./pages/Authentification/ProfileUser";


import Guide from "./pages/guide"
import GuideDetail from "./pages/guidedetail"
import Apropos from "./pages/apropos.js"
import Contact from "./pages/contact.js"
import Monument from "./pages/typezone/Monument.js"
import Plage from "./pages/typezone/Plage.js"
import Culture from "./pages/typezone/Culture.js"
import Desert from "./pages/typezone/Desert.js"
import ForetParc from "./pages/typezone/ForetParc"
import Montagne from "./pages/typezone/Montagne"
import ChoixGuide from "./pages/ChoixGuide.js"



//import Contact from "./pages/contact.js"
//import Contact from "./pages/contact.js"
//import Contact from "./pages/contact.js"

import Header from "./Components/Header"
import HeaderSite from "./Components/HeaderSite"
import Footer from "./Components/Footer"
import NotFound from "./pages/notFound";
import Acceuil from "./pages/acceuil";
import Services from "./pages/Services";
import BoutonDefilant from "./pages/boutonDefilant";
import ZonesTouristiques from "./pages/zonestouristiques";
import TypePlage from "./pages/typezone/Plage";
import Reservation from "./pages/reservation";




/*
import Home from "./Components/Home"
import Home2 from "./Components/Home2"
import Inscription from "./Components/pages/Authentification/Inscription"
import Connexion from "./Components/pages/Authentification/Connexion"
import ProfileUser from "./Components/pages/Authentification/ProfileUser"
import Dashboard from "./Components/pages/dashboard"
*/

function App() {

  //Ici on cree une condition de redirection de l'utilisation de Header selon les routes: 
  //header pour Home, HeaderSites pour les autres pages
  //Sur les pages connexion et inscription pas de header et footer

  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const isHomePage = path === "/";
  const isAuthPage = path === "/authentification/connexion" || path === "/authentification/inscription";

  //Acces protege a la page admin
  const isAuthenticated = !!localStorage.getItem("adminToken");

  // Liste des routes connues
  const knownRoutes = [
    "/", 
    "/dashboard", 
 
    "/guide", 
    "/apropos", 
    "/contact",
    "apropos", 
    "guide",
    "guidedetail",
    "/Services",
    "/zonestouristiques",
    "/authentification/connexion", 
    "/authentification/inscription", 
    "/authentification/profileuser",
    "/typezone/plage",
    "/typezone/culture",
    "/typezone/monument",
    "/typezone/desert",
    "/typezone/foretParc",
    "/typezone/montagne",
  
    "/reservation",
    "/Admin/DashboardAdmin"

  ];

  const isKnownRoute = knownRoutes.includes(path);
  const isNotFoundPage = !isKnownRoute;

  const isNoLayoutPage = isAuthPage || isNotFoundPage;

  return (
    <> 
      {!isNoLayoutPage && (isHomePage ? <Header /> : <HeaderSite />)}

      <Routes>
        <Route path="/" element={<Acceuil />} />
        <Route path="/dashboard" element={<Dashboard />} />
   
        <Route path="/guide" element={<Guide />} />
        <Route path="/apropos" element={<Apropos />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/boutonDefilant" element={<BoutonDefilant />} />
        <Route path="/zonestouristiques" element={<ZonesTouristiques />} />
        <Route path="/reservation" element={<Reservation />} />
       

        {/* pour les types de zones de visite */}
        <Route path="/typezone/plage" element={<TypePlage />} />
        <Route path="/typezone/culture" element={<Culture />} />
        <Route path="/typezone/monument" element={<Monument />} />
        <Route path="/typezone/desert" element={<Desert />} />
        <Route path="/typezone/foretParc" element={<ForetParc />} />
        <Route path="/typezone/montagne" element={<Montagne />} />
     
      
        

        {/* gestion des urls non trouvees avec la page non trouvees */ }
        <Route path="*" element={<NotFound />} />

        {/* ✅ Pages Authentification */}
        <Route path="/authentification/connexion" element={<Connexion />} />
        <Route path="/authentification/inscription" element={<Inscription />} />
        <Route path="/authentification/profileuser" element={<ProfileUser />} />


  {/* ✅ Administration */}
        <Route path="/admin/dashboardAdmin" element={<DashboardAdmin />} />
        <Route path="/guides/dashboardGuide" element={<DashboardGuide />} />
        <Route path="/admin/detailTouriste" element={<DetailTouriste />} />
        <Route path="/admin/detailGuide" element={<DetailGuide />} />
        <Route path="/admin/detailVisite" element={<DetailVisite />} />
        <Route path="/admin/detailAdmin" element={<DetailAdmin />} />
        <Route path="/admin/detailFacture" element={<DetailFacture />} />
        <Route path="/admin/CreationTouriste" element={<CreationTouriste />} />
        <Route path="/admin/CreationAdmin" element={<CreationAdmin />} />
       
        <Route path="/admin/CreationGuide" element={<CreationGuide />} />
        <Route path="/admin/CreationVisite" element={<CreationVisite />} />
        <Route path="/admin/modifierTouriste/:id" element={<ModifierTouriste />} />
        <Route path="/admin/modifierAdmin/:id" element={<ModifierAdmin />} />
        <Route path="/admin/modifierGuide/:id" element={<ModifierGuide />} />
        <Route path="/admin/modifierVisite/:id" element={<ModifierVisite />} />


        <Route path="/Admin" element={<Navigate to="/Admin/connexionadmin" />} />
        <Route path="/Guides" element={<Navigate to="/Guides/connexionguide" />} />
        <Route path="/Admin/connexionadmin" element={<ConnexionAdmin />} />
        <Route path="/Guides/connexionguide" element={<ConnexionGuide />} />
        <Route path="/Admin/reservationListe" element={<ReservationListe />} />

        {/*Typezone  ________________*/}

        <Route path="/typezone/monument" element={<Monument />} />
        <Route path="/typezone/plage" element={<Plage />} />
        <Route path="/typezone/Desert" element={<Desert />} />
        <Route path="/typezone/Montagne" element={<Montagne />} />
        <Route path="/typezone/ForetParc" element={<ForetParc />} />


        <Route path="/confirmation" element={<Confirmation />} />

        
        
        
        <Route path="/typezone/Culture" element={<Culture />} />
        
        
        <Route path="/ChoixGuide" element={<ChoixGuide />} />

        
        {/* Dashboard protégé pour l'admin */}
        <Route
          path="/Admin/DashboardAdmin"
          element={
            isAuthenticated ? <DashboardAdmin /> : <Navigate to="/Admin/connexionadmin" />
          }
        />

        {/* Dashboard protégé pour l'admin */}
          <Route
          path="/Admin/DashboardGuide"
          element={
            isAuthenticated ? <DashboardGuide /> : <Navigate to="/Admin/connexionguide" />
          }
        />


        {/* pour les guides */}
        <Route path="/guide" element={<Guide />} />
        <Route path="/guidedetail" element={<GuideDetail />} />
       
      </Routes>

      {!isNoLayoutPage && <Footer />}
      <BoutonDefilant />   {/* pour le bouton defilant  */}

    </>
  );
}

export default App;
