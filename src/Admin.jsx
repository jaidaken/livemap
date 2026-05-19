import { useEffect, useState } from "react";
import { api } from "./components/functions/api";

// Caddy gates this path behind oauth2-proxy + Pocket-ID upstream.
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
		return <div style={{ padding: 24, color: "#e2e2e2", fontFamily: "monospace" }}>Issuing PostgREST token...</div>;
	}
	if (state.status === "error") {
		return (
			<div style={{ padding: 24, color: "#f88", fontFamily: "monospace" }}>
				<h2>Admin auth error</h2>
				<pre>{state.message}</pre>
			</div>
		);
	}
	return (
		<div style={{ padding: 24, color: "#e2e2e2", fontFamily: "monospace" }}>
			<h2 style={{ marginBottom: 12 }}>swmap admin</h2>
			<p>Signed in as <code>{state.user?.email || state.user?.sub}</code></p>
			<p>PostgREST token stored in localStorage. Editor UI not wired yet.</p>
		</div>
	);
}
