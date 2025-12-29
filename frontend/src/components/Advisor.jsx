import { useState } from "react";
import axios from "axios";

export default function Advisor({ transactions }) {
    const [suggestion, setSuggestion] = useState("");

    const getAdvice = async () => {
        try {
            const res = await axios.post("http://localhost:4000/advisor", transactions);
            setSuggestion(res.data.suggestion);
        } catch (err) {
            console.error(err);
            setSuggestion("Error fetching advice.");
        }
    };

    return (
        <div>
            <button onClick={getAdvice}>Get AI Budget Advice 🎁</button>
            {suggestion && <p>{suggestion}</p>}
        </div>
    );
}
