import React from 'react';
import { AuthProvider } from './hooks/AuthContext';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import FundsList from './components/funds/FundsList';

import SignUp from './components/Presidents/Signup';
import UserList from './components/Presidents/PresidentList';
import UpdateUser from './components/Presidents/updatePresident';
import UserProfileDashboard from './components/Presidents/UserProfileDashboard';
import DashboardPr from './components/President/DashboardPr';
import CreateProgramme from './components/Presidents/CreateProgramme';

import SignupAdmin from './components/AdminPublique/SignupAdmin';
import AdminPubliqueList from './components/AdminPublique/AdminPubliqueList';
import UpdateAdmin from './components/AdminPublique/UpdateAdmin';

import conseillerList from './components/conseillerLocale/conseillerList';
import SignupConseilleur from './components/conseillerLocale/SignupConseilleur';
import UpdateConseilleur from './components/conseillerLocale/UpdateConseilleur';
import ProgrammeList from './components/conseillerLocale/ProgrammeList';
import ProgrammesConseiller from './components/conseillerLocale/ProgrammesConseiller';
import ParentComponent from './components/conseillerLocale/ParentComponent';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route path="/listFund" component={FundsList} />
          <Route path="/PresidentList" component={UserList} />
          <Route path="/update/:id" component={UpdateUser} />
          <Route path="/CreateProgramme" component={CreateProgramme} />
          

          <ProtectedRoute path="/profile" component={UserProfileDashboard} />
          <ProtectedRoute path="/dashboardpr" component={DashboardPr} />

          <Route path="/SignupAdmin" component={SignupAdmin} />
          <Route path="/adminpublique/:id" component={UpdateAdmin} />
          <Route path="/admins" component={AdminPubliqueList} />

          <Route path="/signup_conseilleur" component={SignupConseilleur} />
          <Route path="/conseilleur/:id" component={UpdateConseilleur} />
          <Route path="/conseillerList" component={conseillerList} />
          <Route path="/update/:id" component={UpdateUser} />
          <Route path="/programe/:id/programmes" component={ProgrammeList} />
          <Route path="/api/conseiller-programmes/:id" component={ProgrammesConseiller} />
          <Route path="/ParentComponent" component={ParentComponent} />
          
          

      
          



        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
