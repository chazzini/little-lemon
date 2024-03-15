import React from "react";
import { ProfileProvider } from "./context/ProfileContext";
import Navigation from "./components/Navigation";

export default function App() {
  return (
    <ProfileProvider>
      <Navigation />
    </ProfileProvider>
  );
}
