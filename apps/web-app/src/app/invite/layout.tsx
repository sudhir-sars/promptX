import { ConvexClientProvider } from "@/providers/convex-client";

export default async function InviteLayout({ children }: { children: React.ReactNode }) {
	return <ConvexClientProvider>{children}</ConvexClientProvider>;
}
