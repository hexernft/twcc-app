import PageBackground from "@/components/PageBackground";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageBackground
      image="dashboard"
      blur="medium"
      overlayColor="purple"
      overlayStrength="medium"
    >
      {children}
    </PageBackground>
  );
}