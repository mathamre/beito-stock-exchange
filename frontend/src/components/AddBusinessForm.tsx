"use client";

import { useState } from "react";

const AddBusinessForm = () => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const payload = { name };

        console.log("Payload being sent:", payload); // Debug log

        try {
            const response = await fetch("/api/business", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload), // Ensure payload is serialized
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Business added successfully!");
                setName(""); // Reset form
            } else {
                setMessage(`Error: ${data.error || "Something went wrong"}`);
            }
        } catch (error) {
            console.error("Error during submission:", error); // Debug log
            setMessage(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 border rounded">
            <h2 className="text-xl font-bold">Add a New Business</h2>

            <div>
                <label htmlFor="name" className="block text-sm font-medium">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border p-2 rounded"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
            >
                {loading ? "Submitting..." : "Add Business"}
            </button>

            {message && <p className="mt-2 text-center text-sm">{message}</p>}
        </form>
    );
};

export default AddBusinessForm;
