"use client";

import { useState, useEffect } from "react";

const Card = ({ children }) => (
  <div className="card">{children}</div>
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
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState({});
  const [date, setDate] = useState("");

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <Card className="login-box">
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

  return (
    <<div className="container">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="bg-orange-600 text-white rounded-xl p-4">
          <h1 className="font-bold text-lg">Daily Checklist</h1>
        </div>

        {sections.map((sec, s) => (
          <Card key={s}>
            <h2 className="font-semibold mb-2 text-orange-700">{sec.title}</h2>

            {sec.items.map((item, i) => {
              const id = `${s}-${i}`;

              return (
                <label key={id} className="flex gap-2 items-center mb-1">
                  <Checkbox
                    checked={!!checked[id]}
                    onChange={() =>
                      setChecked((p) => ({ ...p, [id]: !p[id] }))
                    }
                  />

                  <span>{item}</span>
                </label>
              );
            })}
          </Card>
        ))}
      </div>
    </div>
  );
}
