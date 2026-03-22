import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { clsx } from "clsx";

const navClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    "rounded-full px-4 py-2 text-sm font-medium transition",
    isActive
      ? "border border-slate-800 bg-slate-900 text-white shadow-sm"
      : "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-teal-300 hover:bg-teal-50/90"
  );

const navClassAmber = ({ isActive }: { isActive: boolean }) =>
  clsx(
    "rounded-full px-4 py-2 text-sm font-medium transition",
    isActive
      ? "border border-amber-700 bg-amber-600 text-white shadow-sm"
      : "border border-amber-200 bg-amber-50/80 text-amber-950 shadow-sm hover:border-amber-400 hover:bg-amber-50"
  );

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-8">
        <header className="border-b border-slate-200 pb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            โปรแกรมช่วยตัดสินใจ DOAC : preop, reversal
          </h1>
          <p className="mt-2 max-w-5xl text-sm text-slate-600">
            เครื่องมือนี้ช่วยคำนวณ Cockcroft-Gault, CHA₂DS₂-VASc, ประเมินความเสี่ยง thrombosis/bleeding เบื้องต้น แนะนำช่วงหยุดยา-เริ่มยากลับก่อนหัตถการ และสรุปเกณฑ์การพลิกยา DOAC พร้อมหลักฐานทางคลินิก แต่ยังต้องใช้ร่วมกับ clinical judgment, แนวทางของสถาบัน และการประเมิน hemostasis จริงของผู้ป่วย
          </p>
          <nav className="mt-5 flex flex-wrap gap-2" aria-label="หลัก">
            <NavLink to="/" end className={navClass}>
              Preop
            </NavLink>
            <NavLink to="/reversal" className={navClassAmber}>
              Reversal
            </NavLink>
          </nav>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="mt-auto border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          © 2026 directed by{" "}
          <a
            href="mailto:Uradev222@gmail.com"
            className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 transition hover:text-teal-700 hover:decoration-teal-400"
          >
            Uradev
          </a>
        </footer>
      </div>
    </div>
  );
}
