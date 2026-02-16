export const metadata = {
  title: "Daily Store Checklist",
  description: "Store management checklist app",
};

import "../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
