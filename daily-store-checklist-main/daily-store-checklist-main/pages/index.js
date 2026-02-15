import { useState, useEffect } from "react";


// Simple UI Helpers (No external UI libraries)
const Card = ({ children }) => (
  <div className="bg-white rounded-xl shadow p-4">{children}</div>
);

const Button = ({ children, onClick, className = "", type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-4 py-2 rounded font-medium border bg-orange-600 text-white hover:bg-orange-700 ${className}`}
  >
    {children}
  </button>
);

const Checkbox = ({ checked, onChange }) => (
  <input type="checkbox" checked={checked} onChange={onChange} />
);

// Demo Users
const USERS = [
  { username: "admin", password: "1234", role: "Manager" },
  { username: "staff1", password: "1234", role: "Staff" },
  { username: "staff2", password: "1234", role: "Staff" },
];

const sections = [
  {
    title: "Weekly Tasks",
    items: [
      "Complete & Sign Off Ambient Code Checks",
      "Periodic Cleaning Signed Off",
      "Cash & Spot Checks Completed",
      "Lead Area Updates on Teams/Yammer",
    ],
  },
  {
    title: "Morning Checklist (06:00–15:00)",
    items: [
      "Sign Key Book & Safe Book",
      "Print Bakery & Allergen Tickets",
      "Check Monitoring & Promotions",
      "Costa Temp Check",
      "Newspapers & Magazines Scanned",
      "Check Emails & Teams",
      "Review Timecards",
      "Argos Stock Check",
    ],
  },
  {
    title: "Afternoon Checklist (15:00–23:00)",
    items: [
      "Check Emails & Alerts",
      "Waste Integrity Review",
      "Code Check 15:00–17:00",
    ],
  },
];

export default function DailyChecklist() {

  /* LOGIN */
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = () => {
    const found = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!found) return alert("Invalid login");

    setUser(found);
    localStorage.setItem("user", JSON.stringify(found));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  /* DATA */
  const [checked, setChecked] = useState({});
  const [date, setDate] = useState("");

  const [morningStaff, setMorningStaff] = useState("");
  const [morningSign, setMorningSign] = useState("");

  const [afternoonStaff, setAfternoonStaff] = useState("");
  const [afternoonSign, setAfternoonSign] = useState("");

  /* AUTOSAVE */
  useEffect(() => {
    const saved = localStorage.getItem("checklist");
    if (!saved) return;

    const d = JSON.parse(saved);

    setChecked(d.checked || {});
    setDate(d.date || "");
    setMorningStaff(d.morningStaff || "");
    setMorningSign(d.morningSign || "");
    setAfternoonStaff(d.afternoonStaff || "");
    setAfternoonSign(d.afternoonSign || "");
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "checklist",
      JSON.stringify({
        checked,
        date,
        morningStaff,
        morningSign,
        afternoonStaff,
        afternoonSign,
      })
    );
  }, [checked, date, morningStaff, morningSign, afternoonStaff, afternoonSign]);

  const toggle = (id) => {
    setChecked((p) => ({ ...p, [id]: !p[id] }));
  };

  /* SUMMARY */
  const total = sections.reduce((s, a) => s + a.items.length, 0);
  const done = Object.values(checked).filter(Boolean).length;
  const percent = Math.round((done / total) * 100) || 0;

  /* SAVE */
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

  /* LOGIN SCREEN */
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <Card>
          <h2 className="text-xl font-bold mb-4 text-center">Staff Login</h2>

          <input
            placeholder="Username"
            className="w-full border p-2 mb-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full" onClick={login}>
            Login
          </Button>
        </Card>
      </div>
    );
  }

  /* MAIN */
  return (
    <div className="min-h-screen bg-orange-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">

        {/* HEADER */}
        <div className="bg-orange-600 text-white rounded-xl p-4 flex justify-between items-center">
          <h1 className="font-bold text-lg">Daily Checklist</h1>

          <div className="text-right">
            <div>{user.username}</div>
            <div>{percent}%</div>
            <button onClick={logout} className="underline text-sm">Logout</button>
          </div>
        </div>

        {/* DATE */}
        <Card>
          <label>Date</label>
          <input
            type="date"
            className="w-full border p-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Card>

        {/* STAFF */}
        <Card>
          <div className="grid md:grid-cols-2 gap-2">
            <input
              placeholder="Morning Staff"
              className="border p-2"
              value={morningStaff}
              onChange={(e) => setMorningStaff(e.target.value)}
            />

            <input
              placeholder="Morning Signature"
              className="border p-2"
              value={morningSign}
              onChange={(e) => setMorningSign(e.target.value)}
            />

            <input
              placeholder="Afternoon Staff"
              className="border p-2"
              value={afternoonStaff}
              onChange={(e) => setAfternoonStaff(e.target.value)}
            />

            <input
              placeholder="Afternoon Signature"
              className="border p-2"
              value={afternoonSign}
              onChange={(e) => setAfternoonSign(e.target.value)}
            />
          </div>
        </Card>

        {/* CHECKLIST */}
        {sections.map((sec, s) => (
          <Card key={s}>
            <h2 className="font-semibold mb-2 text-orange-700">{sec.title}</h2>

            {sec.items.map((item, i) => {
              const id = `${s}-${i}`;

              return (
                <label key={id} className="flex gap-2 items-center mb-1">
                  <Checkbox
                    checked={!!checked[id]}
                    onChange={() => toggle(id)}
                  />

                  <span
                    className={checked[id] ? "line-through text-gray-400" : ""}
                  >
                    {item}
                  </span>
                </label>
              );
            })}
          </Card>
        ))}

        {/* ACTIONS */}
        <div className="flex justify-center gap-3">
          <Button
            className="bg-gray-500 hover:bg-gray-600"
            onClick={() => localStorage.clear()}
          >
            Reset
          </Button>

          <Button onClick={handleSave}>Save & Export</Button>
        </div>
      </div>
    </div>
  );
}
