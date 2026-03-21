import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PatientAssessmentProvider } from "@/context/PatientAssessmentContext";
import { Layout } from "@/components/Layout";
import PreopPage from "@/pages/PreopPage";
import ReversalPage from "@/pages/ReversalPage";

export default function App() {
  return (
    <PatientAssessmentProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<PreopPage />} />
            <Route path="reversal" element={<ReversalPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PatientAssessmentProvider>
  );
}
