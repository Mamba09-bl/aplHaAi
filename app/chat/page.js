"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Send, Plus, Trash } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function ChatUI() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [alreadyPaid, setalreadyPaid] = useState(false);
  const [showDone, setShowDone] = useState(false); // user HAS paid
  const [notDone, setNotDone] = useState(false); // user NOT paid

  const sidebarRef = useRef(null);

  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollTop = sidebarRef.current.scrollHeight;
    }
  }, [chats]);

  // Load chats
  useEffect(() => {
    const fetchChat = async () => {
      const res = await fetch("/api/chat");
      const result = await res.json();
      console.log(result);

      if (result.alreadyPaid) {
        if (pathname === "/plus") {
          router.push("/alreadyPaid");
          return; // STOP execution
        }
      }
      console.log(pathname);

      if (result.showDone) setShowDone(true);
      if (result.notDone) setNotDone(true);

      setChats(result.Allchat || []);

      if (result.Allchat?.length > 0) {
        const last = result.Allchat[result.Allchat.length - 1];
        setActiveChat(last.messages);
        setActiveChatId(last._id);
      }
    };

    fetchChat();
  }, [pathname]);

  // SEND MESSAGE
  const onSubmit = async (data) => {
    const userMessage = data.message;
    reset();

    // Show message instantly
    setActiveChat((prev) => [...prev, { sender: "user", text: userMessage }]);

    // Sidebar update
    if (activeChatId) {
      setChats((prevChats) =>
        prevChats.map((c) =>
          c._id === activeChatId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { sender: "user", text: userMessage },
                ],
              }
            : c
        )
      );
    } else {
      const temp = {
        _id: "temp",
        messages: [{ sender: "user", text: userMessage }],
      };
      setChats((prev) => [...prev, temp]);
      setActiveChatId("temp");
    }

    // Send to API
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage,
        chatId: activeChatId === "temp" ? null : activeChatId,
      }),
    });

    if (res.status === 403) {
      router.push("/plus");
      return;
    }

    if (res.status === 201) {
      setShowDone(true);
    }
    const result = await res.json();
    const realId = result.activeChatId;

    if (activeChatId === "temp") {
      setChats((prev) => prev.filter((c) => c._id !== "temp"));
    }

    setChats(result.Allchat);
    setActiveChatId(realId);

    const realChat = result.Allchat.find((c) => c._id === realId);
    setActiveChat(realChat.messages);
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-gradient-to-br from-[#0f0f0f] via-[#1c1c1c] to-[#000000] p-2 sm:p-4 gap-4">
      {/* SIDEBAR */}
      <aside
        ref={sidebarRef}
        className="w-full sm:w-64 bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl
        border border-white/10 p-4 flex flex-col gap-4 overflow-y-auto"
      >
        <h2 className="text-xl font-bold text-[#D2E823] mb-3 sm:mb-4">
          ALPHA Chat
        </h2>

        {/* New Chat */}
        <button
          onClick={() => {
            setActiveChat([]);
            setActiveChatId(null);
          }}
          className="flex items-center gap-2 px-4 py-3 rounded-xl 
          bg-[#254F1A] text-[#D2E823] font-semibold hover:bg-[#3a7a2b]"
        >
          <Plus className="w-4 h-4" /> New Chat
        </button>

        {/* Chat List */}
        {chats?.map((chat, index) => {
          const isActive = chat._id === activeChatId;
          const firstMsg =
            chat.messages[0]?.text.substring(0, 15) || "Untitled Chat";

          return (
            <div
              key={index}
              className={`flex items-center justify-between p-2 rounded mb-2 transition-colors ${
                isActive
                  ? "bg-[#D2E823] text-black font-bold"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              <button
                className="flex-1 text-left"
                onClick={() => {
                  setActiveChat(chat.messages);
                  setActiveChatId(chat._id);
                }}
              >
                {firstMsg}
              </button>

              {/* DELETE */}
              <button
                onClick={async () => {
                  await fetch(`/api/chat/${chat._id}`, {
                    method: "DELETE",
                  });

                  setChats((prev) => prev.filter((c) => c._id !== chat._id));

                  if (activeChatId === chat._id) {
                    setActiveChat([]);
                    setActiveChatId(null);
                  }
                }}
                className="ml-3 p-1 rounded hover:bg-red-600/30 transition"
              >
                <Trash className="w-4 h-4 text-red-400 hover:text-red-500" />
              </button>
            </div>
          );
        })}
      </aside>

      {/* CHAT WINDOW */}
      <div className="flex-1 flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col w-full p-4 sm:p-6 gap-4 sm:gap-6 bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10">
          <header className="pb-2 sm:pb-3 border-b border-gray-700/50 flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-[#D2E823]">
              Chat
            </h1>

            <button
              onClick={async () => {
                if (session) {
                  signOut("google");
                  return;
                }
                await fetch("/api/logout", { method: "GET" });
                window.location.href = "/login";
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md"
            >
              Logout
            </button>
          </header>

          {/* ⭐ PAID BANNER ⭐ */}
          {showDone && (
            <div
              className="w-full p-4 rounded-xl bg-green-600/20 border border-green-500
            text-green-300 font-semibold text-center shadow-lg animate-pulse mb-3"
            >
              🌟 ALPHA PLUS Activated — Unlimited Messages Unlocked!
            </div>
          )}

          {/* ⚠ LIMITED USER BANNER (NOT PAID) ⚠ */}
          {!showDone && notDone && (
            <div
              className="w-full p-4 rounded-xl bg-yellow-600/20 border border-yellow-500
            text-yellow-300 font-semibold text-center shadow-lg mb-3 flex flex-col gap-2"
            >
              ⚠ You have limited messages remaining — Upgrade to ALPHA PLUS.
              <button
                onClick={() => router.push("/plus")}
                className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition"
              >
                Upgrade Now
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="border p-3 sm:p-5 rounded-xl h-[60vh] sm:h-96 overflow-y-auto bg-gray-900 border-gray-700 shadow-inner">
            {activeChat.length === 0 && (
              <p className="text-gray-400 text-sm">
                Start a new chat or select one from the sidebar.
              </p>
            )}

            {activeChat.map((msg, i) => (
              <div
                key={i}
                className={`p-3 my-2 sm:my-3 rounded-2xl shadow-lg text-white max-w-[85%] ${
                  msg.sender === "user"
                    ? "bg-[#254F1A] ml-auto rounded-br-sm"
                    : "bg-gray-700 mr-auto rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex gap-2 sm:gap-3 items-center"
          >
            <input
              {...register("message", { required: true })}
              placeholder="Send a new message..."
              className="flex-1 p-3 border rounded-xl bg-transparent border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#254F1A]"
            />

            <button
              type="submit"
              className="px-4 py-3 rounded-xl bg-[#254F1A] text-[#D2E823] font-semibold hover:bg-[#3a7a2b] shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
