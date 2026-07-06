"use client";
import { useState } from "react";

interface FormEventHandler {
    (event: React.FormEvent<HTMLFormElement>): void;
}

const FooterNewsLetter = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleForm: FormEventHandler = (event) => {
        event.preventDefault();

        if (!isChecked) {
            setErrorMsg("Check to submit the form");
            return; // Stop submission
        }

        setErrorMsg(""); // Clear error if checkbox is checked
        const form = event.target as HTMLFormElement;
        form.reset();
        setIsChecked(false);
        alert("Thanks For Subscribing!");
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
        if (e.target.checked) {
            setErrorMsg(""); // Remove error immediately when checkbox is checked
        }
    };

    return (
        <>
            <div className="f-item newsletter">
                <form onSubmit={handleForm}>
                    <input
                        type="email"
                        placeholder="Your Email"
                        className="form-control"
                        name="email"
                        autoComplete="off"
                        required
                    />
                    <button type="submit">
                        <i className="fas fa-arrow-right"></i>
                    </button>
                </form>
            </div>
            <fieldset>
                <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                />
                <label htmlFor="privacy">I agree to the Privacy Policy</label>
            </fieldset>
            {errorMsg && (
                <p style={{ color: "red", marginTop: "5px" }}>{errorMsg}</p>
            )}
        </>
    );
};

export default FooterNewsLetter;
