export function hoursToText(hours: number) {
  if (hours <= 0) return "0 ชั่วโมง";
  if (hours < 24) return `${hours} ชั่วโมง`;
  const days = hours / 24;
  if (Number.isInteger(days)) return `${days} วัน`;
  return `${days.toFixed(1)} วัน`;
}

export type Drug = "apixaban" | "rivaroxaban" | "edoxaban" | "dabigatran";
export type Urgency = "elective" | "urgent" | "emergent";
export type BleedRisk = "minimal" | "lowmoderate" | "high";
export type Sex = "male" | "female";
export type Indication = "af" | "vte" | "cancer_vte";

export const drugLabels: Record<Drug, string> = {
  apixaban: "Apixaban",
  rivaroxaban: "Rivaroxaban",
  edoxaban: "Edoxaban",
  dabigatran: "Dabigatran",
};

export const urgencyLabels: Record<Urgency, string> = {
  elective: "Elective",
  urgent: "Urgent",
  emergent: "Emergent",
};

export const bleedRiskLabels: Record<BleedRisk, string> = {
  minimal: "Minimal",
  lowmoderate: "Low–moderate",
  high: "High",
};

export const sexLabels: Record<Sex, string> = {
  male: "ชาย",
  female: "หญิง",
};

export const indicationLabels: Record<Indication, string> = {
  af: "Atrial fibrillation (AF)",
  vte: "VTE",
  cancer_vte: "Cancer-associated thrombosis",
};

export function calcCockcroftGault(age: number, weightKg: number, scr: number, sex: Sex) {
  if (!age || !weightKg || !scr || scr <= 0) return 0;
  const base = ((140 - age) * weightKg) / (72 * scr);
  return sex === "female" ? base * 0.85 : base;
}

export function calcCha2ds2Vasc({
  age,
  sex,
  chf,
  htn,
  dm,
  stroke,
  vascular,
}: {
  age: number;
  sex: Sex;
  chf: boolean;
  htn: boolean;
  dm: boolean;
  stroke: boolean;
  vascular: boolean;
}) {
  let score = 0;
  if (chf) score += 1;
  if (htn) score += 1;
  if (dm) score += 1;
  if (vascular) score += 1;
  if (stroke) score += 2;
  if (age >= 75) score += 2;
  else if (age >= 65) score += 1;
  if (sex === "female") score += 1;
  return score;
}

export function classifyBleedingRisk(procedure: BleedRisk, neuraxial: boolean, platelets: number, majorCancerSurgery: boolean) {
  if (neuraxial) return "high" as BleedRisk;
  if (majorCancerSurgery) return "high" as BleedRisk;
  if (platelets > 0 && platelets < 50000) return "high" as BleedRisk;
  return procedure;
}

export function estimateThromboticRisk(indication: Indication, vteMonthsAgo: number, recurrentVte: boolean, activeCancer: boolean, cha: number) {
  if (indication === "af") {
    if (cha >= 6) return "สูงมาก";
    if (cha >= 4) return "สูง";
    return "มาตรฐาน";
  }
  if (indication === "vte") {
    if (vteMonthsAgo > 0 && vteMonthsAgo <= 3) return "สูงมาก";
    if (recurrentVte) return "สูง";
    return "มาตรฐาน";
  }
  if (activeCancer) return "สูงมาก";
  return "สูง";
}

export function getDabigatranElectiveHours(bleedRisk: BleedRisk, crcl: number, neuraxial: boolean) {
  if (neuraxial) return 96;
  if (crcl < 30) {
    return bleedRisk === "minimal" ? 72 : 120;
  }
  if (bleedRisk === "minimal") {
    if (crcl >= 50) return 24;
    return 72;
  }
  if (bleedRisk === "lowmoderate") {
    if (crcl >= 80) return 48;
    if (crcl >= 50) return 72;
    return 96;
  }
  if (crcl >= 80) return 48;
  if (crcl >= 50) return 72;
  return 96;
}

export function getXaElectiveHours(bleedRisk: BleedRisk, neuraxial: boolean) {
  if (neuraxial) return 72;
  if (bleedRisk === "minimal") return 0;
  if (bleedRisk === "lowmoderate") return 36;
  return 60;
}

export function getRestartHours(indication: Indication, bleedRisk: BleedRisk, thromboticRisk: string, neuraxial: boolean) {
  if (neuraxial) return 24;
  if (bleedRisk === "minimal") return 6;
  if (bleedRisk === "lowmoderate") {
    if (indication === "cancer_vte" || thromboticRisk === "สูงมาก") return 24;
    return 24;
  }
  if (bleedRisk === "high") {
    if (indication === "cancer_vte" || thromboticRisk === "สูงมาก") return 48;
    return 72;
  }
  return 24;
}

export function getRestartText(indication: Indication, bleedRisk: BleedRisk, thromboticRisk: string, neuraxial: boolean) {
  const restart = getRestartHours(indication, bleedRisk, thromboticRisk, neuraxial);
  let text = `แนะนำเริ่มยากลับประมาณ ${hoursToText(restart)} หลังทำหัตถการ หาก hemostasis ดี`;
  if (bleedRisk === "high") {
    text += " และควรประเมินแผลผ่าตัด/การหยุดเลือดร่วมกับทีมผ่าตัดก่อน";
  }
  if (indication === "cancer_vte") {
    text += " ในผู้ป่วยมะเร็งที่มี VTE ความเสี่ยง thrombosis ระหว่างหยุดยามักสูง ควรรีสตาร์ตเร็วที่สุดเมื่อปลอดภัย";
  }
  if (indication === "vte" && thromboticRisk === "สูงมาก") {
    text += " หาก VTE เกิดภายใน 3 เดือนหรือมี recurrent VTE ให้พิจารณา prophylactic anticoagulation หลังผ่าตัดระยะแรกตามดุลยพินิจทีมรักษา";
  }
  if (indication === "af" && thromboticRisk === "สูงมาก") {
    text += " ใน AF ที่ CHA₂DS₂-VASc สูงมาก ให้ลดช่วงหยุดยาให้น้อยที่สุดเท่าที่ปลอดภัย";
  }
  return text;
}

export interface ReversalInfo {
  primary: string;
  primaryDosing: string[];
  backup: string;
  backupDosing: string[];
  note: string;
  trialData: string[];
  labGuide: string[];
}

export function getReversalInfo(drug: Drug, lifeThreateningBleed: boolean, lastDoseHours: number): ReversalInfo {
  if (drug === "dabigatran") {
    return {
      primary: "Idarucizumab (Praxbind®) — specific reversal agent",
      primaryDosing: [
        "ขนาด: 5 g IV (2 vials x 2.5 g/50 mL) ให้ทาง IV bolus หรือ infusion ห่างกันไม่เกิน 15 นาที",
        "กลไก: monoclonal antibody fragment จับ dabigatran ทั้ง free และ thrombin-bound ด้วย affinity สูงกว่า thrombin 350 เท่า",
        "ข้อบ่งใช้: เลือดออกรุนแรงหรือผู้ป่วยที่ต้องการผ่าตัด/หัตถการเร่งด่วน",
        "ไม่มี procoagulant effect ในอาสาสมัครสุขภาพดี",
      ],
      backup: "หากไม่มี idarucizumab",
      backupDosing: [
        "พิจารณา 4F-PCC 50 units/kg หรือ aPCC (FEIBA) 50 units/kg",
        "Dabigatran สามารถกำจัดได้บางส่วนด้วย hemodialysis (protein binding ต่ำ 35%)",
        "Activated charcoal หากรับประทานยาภายใน 2–4 ชั่วโมง",
      ],
      note: lifeThreateningBleed
        ? "กรณีเลือดออกรุนแรงที่คุกคามชีวิตหรือต้องผ่าตัดฉุกเฉิน ควรให้ idarucizumab ทันที"
        : "พิจารณาใช้เมื่อหัตถการรอไม่ได้และคาดว่ายายังมีฤทธิ์อยู่",
      trialData: [
        "RE-VERSE AD trial (Pollack, NEJM 2015): maximum reversal 100% หลัง infusion แรก",
        "Bleeding group: median time to cessation 11.4 ชั่วโมง (ICH 31%, GIB 34%, trauma 16%)",
        "Surgical group: 92% normal intraoperative hemostasis, 5.4% mild abnormal",
        "Thrombotic events: 5.55% (DVT, PE, cardiac thrombus, NSTEMI, stroke)",
        "dTT กลับสู่ค่าปกติภายใน 12–24 ชม. ใน 90% (bleeding) และ 81% (surgery)",
      ],
      labGuide: [
        "Thrombin time (TT): ไวมาก — TT ปกติ = ไม่มียาในระดับที่มีความสำคัญทางคลินิก (rule out ได้)",
        "aPTT: มักยืดออกที่ peak level แต่ aPTT ปกติ ไม่สามารถ rule out ระดับยาที่มีนัยสำคัญได้",
        "PT: มักไม่เปลี่ยนแปลงขณะใช้ยาตามปกติ",
        "Diluted thrombin time (dTT): specific test สำหรับ dabigatran level",
      ],
    };
  }

  const isLowDose = drug === "apixaban" || (drug === "rivaroxaban" && lastDoseHours > 7);
  const isHighDose = drug === "edoxaban" || (drug === "rivaroxaban" && lastDoseHours <= 7);

  return {
    primary: "Andexanet alfa (Andexxa®/Ondexxya®) — specific reversal agent สำหรับ FXa inhibitors",
    primaryDosing: [
      "กลไก: recombinant modified human FXa decoy protein (catalytically inactive) จับ FXa inhibitors ด้วย affinity สูง",
      `Low dose (สำหรับ apixaban หรือ rivaroxaban ที่รับยาครั้งสุดท้าย >7 ชม.):`,
      "  • Bolus 400 mg IV (≥15 นาที) ตามด้วย infusion 480 mg (2 ชั่วโมง)",
      `High dose (สำหรับ edoxaban, enoxaparin, หรือ rivaroxaban ที่รับยาครั้งสุดท้าย ≤7 ชม.):`,
      "  • Bolus 800 mg IV (≥30 นาที) ตามด้วย infusion 960 mg (2 ชั่วโมง)",
      `ยานี้ → ${isLowDose ? "แนะนำ Low dose regimen" : isHighDose ? "แนะนำ High dose regimen" : "ต้องพิจารณาเวลาที่รับยาล่าสุด"}`,
      "Half-life สั้น (~1 ชม.) จึงต้องให้ทั้ง bolus + infusion เพื่อให้ได้ hemostatic plug",
      "ข้อห้าม: ไม่ได้ label สำหรับ edoxaban โดยตรง แต่มีข้อมูลการใช้ off-label ขนาด high dose",
    ],
    backup: "หากไม่มี andexanet alfa",
    backupDosing: [
      "4-factor PCC (4F-PCC) 25–50 units/kg IV (off-label use)",
      "Meta-analysis (Milioglou, J Thromb Thrombolysis 2021): effective hemostasis 79% (CI 0.74–0.84)",
      "อัตราการเสียชีวิต 16%, thrombotic events 3% (CI 0.02–0.05)",
      "หาก 4F-PCC ไม่มี อาจพิจารณา aPCC (FEIBA) 50 units/kg",
      "Activated charcoal หากรับประทานยาภายใน 2–4 ชั่วโมง",
    ],
    note: drug === "edoxaban"
      ? "Edoxaban: ยังไม่มี reversal agent เฉพาะที่ approved — มักใช้ 4F-PCC ตาม institutional protocol หรือ andexanet high dose (off-label)"
      : `${drugLabels[drug]}: Andexanet alfa ได้รับ FDA approval (2018) สำหรับ apixaban และ rivaroxaban`,
    trialData: [
      "ANNEXA-4 (Connolly, NEJM 2019): prospective, open-label, single group study ใน acute major bleeding",
      "ผู้ป่วย mean age 77 ปี, AF เป็น primary indication 80%, bleeding site: ICH 64%, GI 26%",
      "ลด anti-Xa activity ≥92% หลัง bolus ใน apixaban/rivaroxaban",
      "Hemostatic efficacy (excellent/good) ที่ 12 ชม.: 82% (95%CI 77–87) — GI 85%, ICH 80%",
      "Thrombotic events 30 วัน: 10% (CVA 44%, DVT 38%, MI 20%, PE 14%)",
      "",
      "Andexanet vs 4F-PCC (White, Pharmacotherapy 2024): systematic review & meta-analysis",
      "Andexanet มี hemostatic efficacy สูงกว่า (OR 1.36, 95%CI 1.01–1.84)",
      "Andexanet ลด 30-day mortality (OR 0.53, 95%CI 0.37–0.76)",
      "Thrombotic events: ไม่แตกต่างอย่างมีนัยสำคัญระหว่าง andexanet และ PCC",
    ],
    labGuide: [
      "PT: อาจยืดออกขึ้นกับ sensitivity ของ reagent — PT ปกติ ไม่สามารถ rule out ระดับยาที่สำคัญทางคลินิก (โดยเฉพาะ apixaban)",
      "aPTT: มักไม่เปลี่ยนแปลง — อาจยืดเมื่อระดับยาสูงกว่าปกติ",
      "Anti-Xa (LMWH/UFH chromogenic assay): ค่าปกติ = rule out ระดับยาที่สำคัญได้ (<0.5 IU/mL สำหรับเลือดออก, <0.3 IU/mL สำหรับผ่าตัด)",
      "DOAC-specific anti-Xa assay: cut-off <75 ng/mL (เลือดออก), <30–50 ng/mL (ผ่าตัด)",
    ],
  };
}

export function getSupportiveMeasures(): string[] {
  return [
    "หยุดยา anticoagulant และยาอื่นที่มีผลต่อ hemostasis ทันที",
    "Compression หรือ procedural management เพื่อหยุดเลือดเฉพาะที่",
    "Volume resuscitation ด้วย isotonic crystalloids (NSS/RLS)",
    "Restrictive transfusion: รักษา Hb ≥7 g/dL (≥8 g/dL ในผู้ป่วยที่มี CVD)",
    "รักษา platelets ≥50×10⁹/L และ fibrinogen >100 mg/dL",
    "แก้ไข metabolic disturbances: hypothermia, acidosis, hypocalcemia",
    "Antifibrinolytic (TXA): ให้ภายใน 3 ชม. แรกในผู้ป่วย trauma หรือ mucosal bleeding",
    "Activated charcoal: หากรับประทาน DOAC ภายใน 2–4 ชม.",
    "Massive transfusion protocol: เมื่อต้องการ >3 units PRC ภายใน 1 ชม.",
  ];
}

export function getResumptionGuidelines(indication: Indication, thromboticRisk: string): { risk: string; guidelines: string[] } {
  const isHighThrombotic = thromboticRisk === "สูงมาก" || thromboticRisk === "สูง";
  return {
    risk: isHighThrombotic ? "สูง" : "ต่ำ",
    guidelines: isHighThrombotic ? [
      "ควรเริ่มยากลับเร็วที่สุดเมื่อ hemostasis มั่นคง",
      "GI bleeding: พิจารณาเริ่มกลับหลัง >7 วัน",
      "ICH: พิจารณาเริ่มกลับหลัง >4 สัปดาห์",
      "ระหว่างรอ: พิจารณา IV UFH (prophylactic dose), LMWH, หรือ IVC filter",
      "High thrombotic conditions: mechanical valve + AF, CHA₂DS₂-VASc ≥4, stroke/TIA ภายใน 3 เดือน, LA/LV thrombus",
    ] : [
      "ประเมิน benefit/risk ratio ก่อนเริ่มกลับ",
      "Low thrombotic: non-valvular AF + CHA₂DS₂-VASc <2, provoked VTE ครั้งแรก >3 เดือน",
      "อาจพิจารณาหยุดยา anticoagulant หาก indication ชั่วคราว",
    ],
  };
}

export function getMajorBleedCriteria(): string[] {
  return [
    "Fatal bleeding",
    "Symptomatic bleeding ใน critical organ (CNS, spinal, ocular, thoracic, pericardial, retroperitoneal, intraarticular, intramuscular) — หมายเหตุ: intraluminal GI bleeding ไม่ถือเป็น critical site",
    "Hemoglobin drop ≥2 g/dL หรือต้อง transfuse ≥2 units PRC",
    "Hemodynamic instability: SBP <90 mmHg, ลด >40 mmHg, หรือ MAP <65 mmHg",
  ];
}

export function reversalText(drug: Drug, lifeThreateningBleed: boolean) {
  const info = getReversalInfo(drug, lifeThreateningBleed, 12);
  return {
    primary: info.primary,
    backup: info.backupDosing[0] || info.backup,
    note: info.note,
  };
}
