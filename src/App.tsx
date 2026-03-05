import { BrowserRouter, Route, Routes } from "react-router-dom";
import GameApp from "./GameApp";
import { LinksPage } from "./pages/LinksPage";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/links" element={<LinksPage />} />
				<Route path="/*" element={<GameApp />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
