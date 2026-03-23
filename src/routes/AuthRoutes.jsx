import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/LoginComponents/Login";

export function AuthRoutes({ handleLoginCallback, accessToken, setAccessToken }) {
  return (
    <>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <Login
            onLogin={handleLoginCallback}
            setAccessToken={setAccessToken}
            accessToken={accessToken}
          />
        }
      />
      </>
    
  );
}
