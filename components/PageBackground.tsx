type PageBackgroundProps = {
  image?:
    | "admin"
    | "announcements"
    | "chat"
    | "dashboard"
    | "events"
    | "gallery"
    | "rehearsals"
    | "songs"
    | "members";
  children: React.ReactNode;
  blur?: "soft" | "medium" | "strong";
  overlayColor?: "navy" | "black" | "gold" | "purple" | "green" | "brown";
  overlayStrength?: "soft" | "medium" | "strong";
};

const backgroundImages = {
  admin: "/background/admin-bg.JPG",
  announcements: "/background/announcements-bg.JPG",
  chat: "/background/chat-bg.JPG",
  dashboard: "/background/dashboard-bg.JPG",
  events: "/background/events-bg.JPG",
  gallery: "/background/gallery-bg.JPG",
  rehearsals: "/background/rehearsals-bg.JPG",
  songs: "/background/songs-bg.PNG",
  members: "/background/admin-bg.JPG",
};

const blurLevels = {
  soft: "blur-[2px] scale-[1.03]",
  medium: "blur-[5px] scale-[1.06]",
  strong: "blur-[8px] scale-[1.09]",
};

const overlayColors = {
  navy: "16, 27, 61",
  black: "0, 0, 0",
  gold: "70, 54, 10",
  purple: "37, 24, 68",
  green: "12, 50, 38",
  brown: "55, 35, 20",
};

const overlayOpacity = {
  soft: 0.55,
  medium: 0.68,
  strong: 0.78,
};

export default function PageBackground({
  image = "dashboard",
  children,
  blur = "medium",
  overlayColor = "navy",
  overlayStrength = "medium",
}: PageBackgroundProps) {
  const imagePath = backgroundImages[image] || backgroundImages.dashboard;
  const color = overlayColors[overlayColor] || overlayColors.navy;
  const opacity = overlayOpacity[overlayStrength] || overlayOpacity.medium;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#101B3D] text-[#1F2937]">
      <div
        className={`fixed inset-0 bg-cover bg-center bg-no-repeat ${blurLevels[blur]}`}
        style={{
          backgroundImage: `url(${imagePath})`,
        }}
      />

      <div
        className="fixed inset-0"
        style={{
          backgroundColor: `rgba(${color}, ${opacity})`,
        }}
      />

      <div className="fixed inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/30" />

      <div className="relative z-10 min-h-screen">{children}</div>
    </main>
  );
}