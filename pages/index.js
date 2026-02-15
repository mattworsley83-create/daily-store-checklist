const handleSave = async () => {
  if (!date || !morningStaff || !afternoonStaff)
    return alert("Please complete staff and date");

  const XLSX = await import("xlsx");

  const rows = [];

  sections.forEach((sec, s) => {
    sec.items.forEach((item, i) => {
      const id = `${s}-${i}`;

      rows.push({
        Date: date,
        User: user.username,
        Role: user.role,
        Section: sec.title,
        Task: item,
        Completed: checked[id] ? "Yes" : "No",
        Morning: morningStaff,
        MorningSign: morningSign,
        Afternoon: afternoonStaff,
        AfternoonSign: afternoonSign,
      });
    });
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(wb, ws, date);
  XLSX.writeFile(wb, "Daily_Checklist.xlsx");

  alert("Saved");
};

export default function Home() {
  return <DailyChecklist />;
}

