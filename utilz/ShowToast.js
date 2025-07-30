import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export function showToast(message, type="success") {
    Toastify({
        text: message,
        duration: 4000,
        gravity: "top",
        position: "right",
        backgroundColor: type === "success" ? "#29a730ff" : "#f14021ff",
    }).showToast();
}

