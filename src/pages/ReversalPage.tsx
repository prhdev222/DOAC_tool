import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
import { usePatientAssessment } from "@/context/PatientAssessmentContext";
import { drugLabels } from "@/doac/calc";

export default function ReversalPage() {
  const { drug, plan } = usePatientAssessment();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-amber-950">Reversal</h2>
        <p className="mt-1 text-sm text-amber-900/80">เกณฑ์เลือดออกรุนแรง · ยาพลิก · การแปลผล lab · หลักฐานทางคลินิก</p>
        <p className="mt-3 text-sm text-slate-600">
          ใช้ข้อมูลยาและเวลาจากยาครั้งล่าสุดตามที่กรอกใน{" "}
          <Link to="/" className="font-medium text-teal-700 underline decoration-teal-300 underline-offset-2 hover:text-teal-900">
            หน้า Preop
          </Link>{" "}
          (สถานะเดียวกันทั้งแอป)
        </p>
        <div className="mt-2 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
          ยาที่เลือก: {drugLabels[drug]}
        </div>
        <p className="mt-3 text-xs text-slate-500">เอกสารอ้างอิง PDF (ไทย): เปิดจากเมนู «เอกสาร PCC (ไทย)» ด้านบน</p>
      </div>

      <div className="space-y-6">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">เกณฑ์ Major Bleeding (ISTH)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="mb-2 text-sm text-slate-600">ต้องมี ≥1 ข้อ ร่วมกับระดับยาที่คาดว่ายังมีผลทางคลินิก จึงจะพิจารณาให้ reversal agent</div>
            {plan.majorBleedCriteria.map((c, i) => (
              <Alert key={i} className="rounded-xl py-2">
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription className="text-sm">{c}</AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-amber-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-amber-800">
              Specific Reversal Agent: {drug === "dabigatran" ? "Idarucizumab" : "Andexanet Alfa"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="rounded-xl border-amber-300 bg-amber-50">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">{plan.reversalDetailed.primary}</AlertTitle>
              <AlertDescription className="text-sm text-amber-700">{plan.reversalDetailed.note}</AlertDescription>
            </Alert>

            <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
              <div className="text-sm font-medium text-amber-900">ขนาดยาและวิธีการให้</div>
              {plan.reversalDetailed.primaryDosing.map((d, i) => (
                <div key={i} className="text-sm leading-relaxed text-slate-700">
                  {d}
                </div>
              ))}
            </div>

            <div className="space-y-2 rounded-xl border p-4">
              <div className="text-sm font-medium text-slate-800">{plan.reversalDetailed.backup}</div>
              {plan.reversalDetailed.backupDosing.map((d, i) => (
                <div key={i} className="flex gap-2 text-sm text-slate-600">
                  <span className="shrink-0 text-slate-400">•</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">การแปลผล Lab สำหรับ {drugLabels[drug]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="mb-2 text-sm text-slate-500">อ้างอิง: Sarode, ASH Educ Program 2019; Tomaselli, JACC 2020</div>
            {plan.reversalDetailed.labGuide.map((l, i) => (
              <div key={i} className="rounded-lg border p-3 text-sm">
                <span>{l}</span>
              </div>
            ))}
            <Alert className="mt-3 rounded-xl">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription className="text-sm">
                ควรส่งตรวจ CBC, creatinine, PT/INR, aPTT, fibrinogen ทุกราย และเตรียม blood products ตามความจำเป็น
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">หลักฐานทางคลินิก (Clinical Evidence)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {plan.reversalDetailed.trialData.map((t, i) =>
              t === "" ? (
                <Separator key={i} className="my-2" />
              ) : (
                <div key={i} className="flex gap-2 text-sm leading-relaxed text-slate-700">
                  <span className="mt-0.5 shrink-0 text-blue-500">•</span>
                  <span>{t}</span>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
