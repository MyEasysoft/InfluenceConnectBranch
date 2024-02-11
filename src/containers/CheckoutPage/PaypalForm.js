import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PaypalApp() {
    return (
        <PayPalScriptProvider options={{ clientId: "test" }}>
            <PayPalButtons style={{ layout: "horizontal" }} />
        </PayPalScriptProvider>
    );
}