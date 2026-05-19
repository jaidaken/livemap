import { useEffect, useState } from "react";
import { MapContainer } from "react-leaflet";
import { CRS } from "leaflet";
import { api } from "./components/functions/api";
import { SystemProvider } from "./components/functions/SystemProvider";
import AddSystemForm from "./components/AddSystem";

// Caddy gates /admin behind oauth2-proxy + Pocket-ID passkey upstream.
export default function Admin() {
	const [state, setState] = useState({ status: "issuing" });

	useEffect(() => {
		fetch("https://auth.swmap.xyz/auth/issue", { credentials: "include" })
			.then(async (r) => {
				if (!r.ok) throw new Error("issue failed: " + r.status);
				const data = await r.json();
				if (!data.access_token) throw new Error("no token");
				localStorage.setItem("swmap_auth_v2", data.access_token);
				api.authToken = data.access_token;
				setState({ status: "ready", user: data.user });
			})
			.catch((err) => setState({ status: "error", message: String(err) }));
	}, []);

	if (state.status === "issuing") {
		return <div style={{ padding: 24, color: "#e2e2e2" }}>Issuing PostgREST token...</div>;
	}
	if (state.status === "error") {
		return (
			<div style={{ padding: 24, color: "#f88" }}>
				<h2>Admin auth error</h2>
				<pre>{state.message}</pre>
			</div>
		);
	}
	return (
		<SystemProvider>
			<div style={{ padding: 24, color: "#e2e2e2" }}>
				<h2 style={{ marginBottom: 12 }}>swmap admin (signed in as {state.user?.email || state.user?.sub})</h2>
				<MapContainer
					center={[0, 0]}
					zoom={2}
					crs={CRS.Simple}
					style={{ height: "70vh", width: "100%" }}
				>
					<AddSystemForm />
				</MapContainer>
			</div>
		</SystemProvider>
	);
}
