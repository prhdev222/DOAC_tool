import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ShieldAlert, Clock3, Syringe, Activity, CheckCircle2, Calculator } from "lucide-react";
import { usePatientAssessment } from "@/context/PatientAssessmentContext";
import {
  bleedRiskLabels,
  drugLabels,
  hoursToText,
  indicationLabels,
  sexLabels,
  urgencyLabels,
  type BleedRisk,
  type Drug,
  type Indication,
  type Sex,
  type Urgency,
} from "@/doac/calc";

export default function PreopPage() {
  const {
    drug,
    setDrug,
    urgency,
    setUrgency,
    baseBleedRisk,
    setBaseBleedRisk,
    lastDoseHours,
    setLastDoseHours,
    neuraxial,
    setNeuraxial,
    activeBleeding,
    setActiveBleeding,
    indication,
    setIndication,
    sex,
    setSex,
    age,
    setAge,
    weightKg,
    setWeightKg,
    scr,
    setScr,
    platelets,
    setPlatelets,
    majorCancerSurgery,
    setMajorCancerSurgery,
    activeCancer,
    setActiveCancer,
    vteMonthsAgo,
    setVteMonthsAgo,
    recurrentVte,
    setRecurrentVte,
    chf,
    setChf,
    htn,
    setHtn,
    dm,
    setDm,
    stroke,
    setStroke,
    vascular,
    setVascular,
    plan,
  } = usePatientAssessment();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Preop</h2>
        <p className="mt-1 text-sm text-slate-600">แผนก่อนหัตถการ · ประเมินความเสี่ยง · ช่วงหยุดยาและเริ่มยากลับ</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">ข้อมูลนำเข้า</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>ข้อบ่งใช้</Label>
              <Select value={indication} onValueChange={(v) => setIndication(v as Indication)}>
                <SelectTrigger>
                  <span>{indicationLabels[indication]}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="af">Atrial fibrillation (AF)</SelectItem>
                  <SelectItem value="vte">VTE</SelectItem>
                  <SelectItem value="cancer_vte">Cancer-associated thrombosis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>ยา DOAC</Label>
              <Select value={drug} onValueChange={(v) => setDrug(v as Drug)}>
                <SelectTrigger>
                  <span>{drugLabels[drug]}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apixaban">Apixaban</SelectItem>
                  <SelectItem value="rivaroxaban">Rivaroxaban</SelectItem>
                  <SelectItem value="edoxaban">Edoxaban</SelectItem>
                  <SelectItem value="dabigatran">Dabigatran</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>อายุ (ปี)</Label>
                <Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value || 0))} />
              </div>
              <div className="space-y-2">
                <Label>เพศ</Label>
                <Select value={sex} onValueChange={(v) => setSex(v as Sex)}>
                  <SelectTrigger>
                    <span>{sexLabels[sex]}</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ชาย</SelectItem>
                    <SelectItem value="female">หญิง</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>น้ำหนัก (kg)</Label>
                <Input type="number" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value || 0))} />
              </div>
              <div className="space-y-2">
                <Label>Serum Cr (mg/dL)</Label>
                <Input type="number" step="0.01" value={scr} onChange={(e) => setScr(Number(e.target.value || 0))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>เกล็ดเลือด (/µL)</Label>
              <Input type="number" value={platelets} onChange={(e) => setPlatelets(Number(e.target.value || 0))} />
            </div>

            <div className="space-y-2">
              <Label>ความเร่งด่วนของหัตถการ</Label>
              <Select value={urgency} onValueChange={(v) => setUrgency(v as Urgency)}>
                <SelectTrigger>
                  <span>{urgencyLabels[urgency]}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elective">Elective</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="emergent">Emergent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Bleeding risk ของหัตถการ</Label>
              <Select value={baseBleedRisk} onValueChange={(v) => setBaseBleedRisk(v as BleedRisk)}>
                <SelectTrigger>
                  <span>{bleedRiskLabels[baseBleedRisk]}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="lowmoderate">Low–moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>ชั่วโมงจากยาครั้งล่าสุด</Label>
              <Input type="number" value={lastDoseHours} onChange={(e) => setLastDoseHours(Number(e.target.value || 0))} />
            </div>

            {indication !== "af" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>VTE เกิดเมื่อกี่เดือนก่อน</Label>
                  <Input type="number" value={vteMonthsAgo} onChange={(e) => setVteMonthsAgo(Number(e.target.value || 0))} />
                </div>
                <div className="flex items-end justify-between rounded-xl border p-3">
                  <Label>Recurrent VTE</Label>
                  <Switch checked={recurrentVte} onCheckedChange={setRecurrentVte} />
                </div>
              </div>
            )}

            {indication === "af" && (
              <div className="space-y-3 rounded-xl border p-4">
                <div className="text-sm font-medium">องค์ประกอบ CHA₂DS₂-VASc</div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <Label>CHF/LV dysfunction</Label>
                    <Switch checked={chf} onCheckedChange={setChf} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Hypertension</Label>
                    <Switch checked={htn} onCheckedChange={setHtn} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Diabetes</Label>
                    <Switch checked={dm} onCheckedChange={setDm} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Stroke/TIA/TE</Label>
                    <Switch checked={stroke} onCheckedChange={setStroke} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Vascular disease</Label>
                    <Switch checked={vascular} onCheckedChange={setVascular} />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <Label>Neuraxial / spinal / epidural</Label>
                <Switch checked={neuraxial} onCheckedChange={setNeuraxial} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Active major bleeding</Label>
                <Switch checked={activeBleeding} onCheckedChange={setActiveBleeding} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Major cancer surgery</Label>
                <Switch checked={majorCancerSurgery} onCheckedChange={setMajorCancerSurgery} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Active cancer</Label>
                <Switch checked={activeCancer} onCheckedChange={setActiveCancer} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Calculator className="h-5 w-5 shrink-0" />
                  <div>
                    <div className="text-sm text-slate-500">CrCl</div>
                    <div className="text-2xl font-semibold">{plan.crcl.toFixed(1)}</div>
                    <div className="text-xs text-slate-500">mL/min</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 shrink-0" />
                  <div>
                    <div className="text-sm text-slate-500">CHA₂DS₂-VASc</div>
                    <div className="text-2xl font-semibold">{indication === "af" ? plan.cha : "-"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 shrink-0" />
                  <div>
                    <div className="text-sm text-slate-500">ช่วงหยุดยาก่อนผ่าตัด</div>
                    <div className="text-lg font-semibold sm:text-xl">{hoursToText(plan.electiveHoldHours)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Syringe className="h-5 w-5 shrink-0" />
                  <div>
                    <div className="text-sm text-slate-500">เริ่มยากลับ</div>
                    <div className="text-lg font-semibold sm:text-xl">{hoursToText(plan.restartHours)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">สรุปความเสี่ยงอัตโนมัติ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">ข้อบ่งใช้: {indicationLabels[indication]}</Badge>
                <Badge variant="secondary">Bleeding risk ที่จัดจริง: {bleedRiskLabels[plan.bleedRisk] || plan.bleedRisk}</Badge>
                <Badge variant="secondary">Thrombotic risk: {plan.thromboticRisk}</Badge>
                <Badge variant="secondary">เหลือเวลารอ: {hoursToText(plan.remaining)}</Badge>
              </div>
              <Alert className="rounded-xl">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{plan.restartText}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">คำแนะนำหลัก</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {plan.messages.map((m, i) => (
                <Alert key={i} className="rounded-xl">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{m}</AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">การดูแลเบื้องต้น (Supportive Measures)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="mb-2 text-sm text-slate-600">
                ต้องให้ในผู้ป่วยทุกราย ไม่ว่าจะใช้ยาตัวใด (Tomaselli, JACC 2020; Cuker, Am J Hematol 2019)
              </div>
              {plan.supportiveMeasures.map((m, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="mt-0.5 shrink-0 text-emerald-600">•</span>
                  <span>{m}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">แนวทางการเริ่มยา Anticoagulant กลับ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant={plan.resumption.risk === "สูง" ? "destructive" : "secondary"}>Thrombotic risk: {plan.resumption.risk}</Badge>
                <span className="text-sm text-slate-500">(Tomaselli, JACC 2020)</span>
              </div>
              {plan.resumption.guidelines.map((g, i) => (
                <div key={i} className="flex gap-2 text-sm text-slate-700">
                  <span className="mt-0.5 shrink-0 text-indigo-500">•</span>
                  <span>{g}</span>
                </div>
              ))}
              <Separator />
              <div className="text-sm text-slate-600">
                <span className="font-medium">ระยะเวลาแนะนำ: </span>
                GI bleeding → พิจารณาเริ่มกลับหลัง &gt;7 วัน | ICH → พิจารณาเริ่มกลับหลัง &gt;4 สัปดาห์
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">ข้อควรระวัง</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {plan.cautions.length === 0 ? (
                <div className="text-sm text-slate-600">ไม่มี safety flag เพิ่มเติมจากข้อมูลที่กรอก</div>
              ) : (
                plan.cautions.map((c, i) => (
                  <Alert key={i} className="rounded-xl">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertDescription>{c}</AlertDescription>
                  </Alert>
                ))
              )}
              <Separator />
              <div className="text-xs leading-6 text-slate-500">
                เครื่องมือนี้เป็น clinical decision-support prototype เพื่อช่วยการประเมินเบื้องต้น ไม่ทดแทนแนวทางเวชปฏิบัติ, package insert, หรือการปรึกษาร่วมกับทีมผ่าตัด/วิสัญญี/hematology ของสถาบัน
              </div>
              <div className="text-xs leading-5 text-slate-400">
                อ้างอิง: Lamool R. VTE Day 2026; Tomaselli GF, et al. JACC. 2020;76(5); Cuker A, et al. Am J Hematol. 2019;94; Pollack CV, et al. NEJM. 2015; Connolly SJ, et al. NEJM. 2019;380(14); Sarode R, et al. Circulation. 2013;128; White CM, et al. Pharmacotherapy. 2024;44; Milioglou I, et al. J Thromb Thrombolysis. 2021
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
