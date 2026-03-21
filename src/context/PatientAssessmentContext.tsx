import React, { createContext, useContext, useMemo, useState } from "react";
import {
  type BleedRisk,
  type Drug,
  type Indication,
  type Sex,
  type Urgency,
  calcCha2ds2Vasc,
  calcCockcroftGault,
  classifyBleedingRisk,
  estimateThromboticRisk,
  getDabigatranElectiveHours,
  getMajorBleedCriteria,
  getResumptionGuidelines,
  getReversalInfo,
  getSupportiveMeasures,
  getRestartHours,
  getRestartText,
  getXaElectiveHours,
  hoursToText,
  reversalText,
} from "@/doac/calc";

function usePatientAssessmentValue() {
  const [drug, setDrug] = useState<Drug>("apixaban");
  const [urgency, setUrgency] = useState<Urgency>("elective");
  const [baseBleedRisk, setBaseBleedRisk] = useState<BleedRisk>("high");
  const [lastDoseHours, setLastDoseHours] = useState<number>(12);
  const [neuraxial, setNeuraxial] = useState(false);
  const [activeBleeding, setActiveBleeding] = useState(false);

  const [indication, setIndication] = useState<Indication>("af");
  const [sex, setSex] = useState<Sex>("female");
  const [age, setAge] = useState<number>(70);
  const [weightKg, setWeightKg] = useState<number>(60);
  const [scr, setScr] = useState<number>(1.0);
  const [platelets, setPlatelets] = useState<number>(150000);
  const [majorCancerSurgery, setMajorCancerSurgery] = useState(false);
  const [activeCancer, setActiveCancer] = useState(false);
  const [vteMonthsAgo, setVteMonthsAgo] = useState<number>(1);
  const [recurrentVte, setRecurrentVte] = useState(false);

  const [chf, setChf] = useState(false);
  const [htn, setHtn] = useState(false);
  const [dm, setDm] = useState(false);
  const [stroke, setStroke] = useState(false);
  const [vascular, setVascular] = useState(false);

  const plan = useMemo(() => {
    const crcl = calcCockcroftGault(age, weightKg, scr, sex);
    const cha = calcCha2ds2Vasc({ age, sex, chf, htn, dm, stroke, vascular });
    const bleedRisk = classifyBleedingRisk(baseBleedRisk, neuraxial, platelets, majorCancerSurgery);
    const thromboticRisk = estimateThromboticRisk(indication, vteMonthsAgo, recurrentVte, activeCancer, cha);

    const isXa = drug !== "dabigatran";
    const electiveHoldHours = isXa
      ? getXaElectiveHours(bleedRisk, neuraxial)
      : getDabigatranElectiveHours(bleedRisk, crcl, neuraxial);

    const elapsed = Number.isFinite(lastDoseHours) ? lastDoseHours : 0;
    const remaining = Math.max(electiveHoldHours - elapsed, 0);
    const restartHours = getRestartHours(indication, bleedRisk, thromboticRisk, neuraxial);
    const restartText = getRestartText(indication, bleedRisk, thromboticRisk, neuraxial);
    const reversal = reversalText(drug, activeBleeding);

    const messages: string[] = [];
    const cautions: string[] = [];

    if (urgency === "elective") {
      if (electiveHoldHours === 0) {
        messages.push("หัตถการเสี่ยงเลือดออกต่ำมาก: อาจทำแบบไม่ต้องหยุดยา หรือข้ามเฉพาะ dose วันทำหัตถการตามดุลยพินิจ");
      } else {
        messages.push(`ควรหยุดยาอย่างน้อย ${hoursToText(electiveHoldHours)} ก่อนทำหัตถการ`);
      }
      if (remaining > 0) {
        messages.push(`จากเวลาที่รับประทานยาล่าสุด ควรรอเพิ่มอีกประมาณ ${hoursToText(remaining)}`);
      } else {
        messages.push("ครบระยะหยุดยาขั้นต่ำแล้ว สามารถพิจารณาทำหัตถการได้หากปัจจัยอื่นพร้อม");
      }
      messages.push(restartText);
      messages.push("โดยทั่วไปไม่แนะนำ bridging ด้วย heparin สำหรับ DOAC ที่หยุดชั่วคราวก่อนผ่าตัด");
      if (bleedRisk === "high" && (indication === "cancer_vte" || thromboticRisk === "สูงมาก")) {
        messages.push("หากยังไม่สามารถเริ่ม DOAC เต็มขนาดได้หลังผ่าตัด อาจพิจารณา prophylactic-dose anticoagulation ชั่วคราวเมื่อการหยุดเลือดมั่นคงแล้ว");
      }
    }

    if (urgency === "urgent") {
      messages.push("กรณีเร่งด่วน: หากรอได้ ควรเลื่อนจนกว่าจะครบช่วงหยุดยาที่เหมาะสม");
      if (remaining > 0) messages.push(`หากเลื่อนได้ ควรรอเพิ่มประมาณ ${hoursToText(remaining)}`);
      messages.push(reversal.primary);
      messages.push(reversal.note);
    }

    if (urgency === "emergent") {
      messages.push("กรณีฉุกเฉิน: ไม่ควรชะลอหัตถการที่ช่วยชีวิตเพียงเพื่อรอให้ครบช่วงหยุดยา");
      messages.push("ให้จัดการ hemostatic support, blood products, lab monitoring และ reversal ไปพร้อมกันตามความเหมาะสม");
      messages.push(reversal.primary);
      messages.push(reversal.backup);
    }

    if (drug === "dabigatran" && crcl < 50) {
      cautions.push("การทำงานไตลดลงทำให้ dabigatran ค้างนานขึ้น จึงต้องหยุดยานานกว่ายากลุ่ม factor Xa inhibitor");
    }
    if (neuraxial) {
      cautions.push("หัตถการ neuraxial ต้องใช้แนวทางระมัดระวังมากขึ้น และควรประสานกับวิสัญญีแพทย์");
    }
    if (platelets > 0 && platelets < 50000) {
      cautions.push("เกล็ดเลือดต่ำกว่า 50,000/µL เพิ่มความเสี่ยงเลือดออกอย่างมีนัยสำคัญ ต้องประเมินเป็นรายกรณี");
    }
    if (indication === "cancer_vte" && activeCancer) {
      cautions.push("มะเร็งที่ยัง active เพิ่มความเสี่ยง recurrent thrombosis ระหว่างช่วงหยุดยา");
    }
    if (indication === "vte" && vteMonthsAgo > 0 && vteMonthsAgo <= 3) {
      cautions.push("VTE ภายใน 3 เดือนล่าสุดเป็นกลุ่ม thrombotic risk สูงมาก ควรลดช่วงหยุดยาให้น้อยที่สุดเท่าที่ปลอดภัย");
    }
    if (activeBleeding) {
      cautions.push("หากมีเลือดออกรุนแรงอยู่จริง ต้องใช้ major bleeding protocol ร่วมกับการหา source control ไม่ใช่อาศัย calculator เพียงอย่างเดียว");
    }

    const reversalDetailed = getReversalInfo(drug, activeBleeding, lastDoseHours);
    const supportiveMeasures = getSupportiveMeasures();
    const resumption = getResumptionGuidelines(indication, thromboticRisk);
    const majorBleedCriteria = getMajorBleedCriteria();

    return {
      crcl,
      cha,
      bleedRisk,
      thromboticRisk,
      electiveHoldHours,
      remaining,
      restartHours,
      restartText,
      messages,
      cautions,
      reversal,
      reversalDetailed,
      supportiveMeasures,
      resumption,
      majorBleedCriteria,
    };
  }, [drug, urgency, baseBleedRisk, lastDoseHours, neuraxial, activeBleeding, indication, sex, age, weightKg, scr, platelets, majorCancerSurgery, activeCancer, vteMonthsAgo, recurrentVte, chf, htn, dm, stroke, vascular]);

  return {
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
  };
}

type PatientAssessmentContextValue = ReturnType<typeof usePatientAssessmentValue>;

const PatientAssessmentContext = createContext<PatientAssessmentContextValue | null>(null);

export function PatientAssessmentProvider({ children }: { children: React.ReactNode }) {
  const value = usePatientAssessmentValue();
  return <PatientAssessmentContext.Provider value={value}>{children}</PatientAssessmentContext.Provider>;
}

export function usePatientAssessment() {
  const ctx = useContext(PatientAssessmentContext);
  if (!ctx) throw new Error("usePatientAssessment must be used within PatientAssessmentProvider");
  return ctx;
}
