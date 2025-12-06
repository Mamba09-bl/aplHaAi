// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   useStripe,
//   useElements,
//   PaymentElement,
// } from "@stripe/react-stripe-js";
// import convertToSubcurrency from "../../lib/convertToSubcurrency";

// const CheckoutPage = ({ amount }: { amount: number }) => {
//   const stripe = useStripe();
//   const elements = useElements();

  
//   const [name, setName] = useState(""); // <-- new
//   const [email, setEmail] = useState(""); // <-- new
//   const [errorMessage, setErrorMessage] = useState<string>();
//   const [clientSecret, setClientSecret] = useState("");
//   const [loading, setLoading] = useState(false);

// // useEffect(() => {
// //   fetch("/api/create-payment-intent", {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //     body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
// //   })
// //     .then((res) => res.json())
// //     .then((data) => setClientSecret(data.clientSecret));
// // }, [amount]);
// useEffect(() => {
//   if (!email) return; // don't call API until email is typed

//   const createSession = async () => {
//     const res = await fetch("/api/checkout", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email: email, // send email ONLY (Checkout sessions handle pricing server-side)
//       }),
//     });

//     const data = await res.json();

//     if (data.url) {
//       window.location.href = data.url; // redirect to Stripe Checkout page
//     }
//   };

//   createSession();
// }, [email]);


  
// const handleSubmit = async(event:React.FormEvent<HTMLFormElement>)=>{
// event.preventDefault();
// setLoading(true)

// if(!stripe || !elements){
//     return;
// }
// const{error:submitError} = await elements.submit();
// if(submitError){
//     setErrorMessage(submitError.message)
//     setLoading(false)
//     return
// }
// const {error}  = await stripe.confirmPayment({
//     elements,
//     clientSecret,
//     confirmParams:{
//   return_url: `http://localhost:3000/payment-success?amount=${amount}&name=${name}&email=${email}`

//     }
// })


// if(error){
//     setErrorMessage(error.message)
// }else{

// }
// setLoading(false)
// }

// if (!clientSecret || !stripe || !elements) {
//   return (
//     <div className="flex items-center justify-center">
//       <div>
//         <div
//           className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
//           role="status"
//         >
//           <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
//             Loading...
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// return(
//     <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
//         <input
//   type="text"
//   placeholder="Your Name"
//   value={name}
//   onChange={e => setName(e.target.value)}
//   className="w-full p-2 border border-gray-300 rounded mb-3 text-black placeholder-gray-400"
//   required
// />

//    <input
//   type="email"
//   placeholder="Your Email"
//   value={email}
//   onChange={e => setEmail(e.target.value)}
//   className="w-full p-2 border border-gray-300 rounded mb-3 text-black placeholder-gray-400"
//   required
// />
//         {clientSecret && <PaymentElement/>}
//         <button disabled={!stripe || loading} className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled: opacity-50 disabled:animate-pulse">{!loading ? `Pay $${amount}`: 'Processing...'}</button>
//     </form>
// )
// };

// export default CheckoutPage;



"use client";

import { useState,useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


export default  function CheckoutPage({ amount }: { amount: number }) {

  const { data: session } = useSession();
  const [email, setEmail] = useState( session?.user?.email ||"");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    
  async function loadEmail() {
    // 1) NextAuth session available?

    const ress = await fetch("/api/chat");
      const result = await ress.json();

      if (result.alreadyPaid) {
        router.replace("/alreadyPaid");
      }
      
    if (session?.user?.email) {
      setEmail(session.user.email);
      return;
    }

    // 2) Otherwise check custom JWT user
    const res = await fetch("/api/me");
    const data = await res.json();

    if (data?.user?.email) {
      setEmail(data.user.email);
    }
  }

  loadEmail();
}, [session]);


  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email) {
      alert("Email required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!data.url) {
        alert("Checkout session failed");
        setLoading(false);
        return;
      }

      window.location.href = data.url; // IMPORTANT: redirect to Stripe
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleCheckout} className="bg-white p-4 rounded-md text-black">
       <input
    type="email"
    placeholder="Your Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded mb-3"
    required
  />

      <button
        disabled={loading}
        className="bg-black w-full text-white p-3 rounded-md"
      >
        {loading ? "Redirecting..." : `Pay $${amount}`}
      </button>
    </form>
  );
}
