import OpenAI from "openai"; // <- ADD THIS
import chatModel from "@/modules/chat";
import { getUser } from "@/lib/getUser";
import userModel from "@/modules/user";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  await connectDB();
  const auth = await getUser();
  if (!auth || !auth.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // console.log("Logged in user:", auth.user);

  // const Allchat = await chatModel.find({});
  const Allchat = await chatModel.find({ userEmail: auth.user.email });
  const Alluser = await userModel.findOne({ email: auth.user.email });
  console.log("allusererrerer:", Alluser);

  // if (Alluser.hasPaid === true) {
  //   return Response.json({
  //     Allchat,
  //     showDone: true,
  //   });
  // }
  // console.log("working:", Allchat);

  console.log("working:", Allchat);
  return Response.json({
    Allchat,
    showDone: Alluser.hasPaid === true,
    notDone: Alluser.hasPaid === false,
    alreadyPaid: Alluser.hasPaid === true,
  });
}

// code one
export async function POST(req) {
  try {
    await connectDB();
    const auth = await getUser();
    const Alluser = await userModel.findOne({ email: auth.user.email });

    if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { message, chatId, totalNumber } = await req.json();

    if (Alluser.freeMessagesUsed >= 5 && Alluser.hasPaid === false) {
      return Response.json(
        { block: true, message: "Upgrade required" },
        { status: 403 }
      );
    }

    // if (Alluser.hasPaid === true) {
    //   return Response.json(
    //     { done: true, message: "Upgrade done" },
    //     { status: 200 }
    //   );
    // }

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    let Chat = await chatModel.findById(chatId);

    // Build conversation context
    let ChatHistory = [];
    if (Chat) {
      ChatHistory = Chat.messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...ChatHistory, // ← PREVIOUS CHAT MEMORY
        { role: "user", content: message }, // ← new user message
      ],
    });

    const reply = completion.choices[0].message.content;

    if (Chat) {
      Chat.messages.push({ sender: "user", text: message });
      Chat.messages.push({ sender: "bot", text: reply });
      await Chat.save();
    } else {
      Chat = await chatModel.create({
        userEmail: auth.user.email,
        messages: [
          { sender: "user", text: message },
          { sender: "bot", text: reply },
        ],
      });
    }

    if (Alluser.hasPaid == false) {
      Alluser.freeMessagesUsed++;
      await Alluser.save();
    }
    const allChats = await chatModel.find({ userEmail: auth.user.email });

    return Response.json({
      Allchat: allChats,
      activeChatId: Chat._id,
    });
  } catch (err) {
    console.log(err);
    return Response.json({ reply: "Error happened." }, { status: 500 });
  }
}

//  code two
// export async function POST(req) {
//   try {
//     const auth = await getUser();
//     const Alluser = await userModel.findOne({ email: auth.user.email });

//     if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

//     const { message, chatId, totalNumber } = await req.json();

//     if (Alluser.freeMessagesUsed >= 12 && Alluser.hasPaid === false) {
//       return Response.json(
//         { block: true, message: "Upgrade required" },
//         { status: 403 }
//       );
//     }

//     if (Alluser.freeMessagesUsed >= 11 && Alluser.hasPaid === false) {
//       return Response.json(
//         { sendMessage: true, message: "Upgrade required" },
//         { status: 200 }
//       );
//     }

//     const client = new OpenAI({
//       apiKey: process.env.GROQ_API_KEY,
//       baseURL: "https://api.groq.com/openai/v1",
//     });

//     let Chat = await chatModel.findById(chatId);

//     // Build conversation context
//     let ChatHistory = [];
//     if (Chat) {
//       ChatHistory = Chat.messages.map((msg) => ({
//         role: msg.sender === "user" ? "user" : "assistant",
//         content: msg.text,
//       }));
//     }

//     // Main AI request with memory
//     const completion = await client.chat.completions.create({
//       model: "llama-3.3-70b-versatile",
//       messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         ...ChatHistory, // ← PREVIOUS CHAT MEMORY
//         { role: "user", content: message }, // ← new user message
//       ],
//     });

//     const reply = completion.choices[0].message.content;

//     if (Chat) {
//       Chat.messages.push({ sender: "user", text: message });
//       Chat.messages.push({ sender: "bot", text: reply });
//       await Chat.save();
//     } else {
//       Chat = await chatModel.create({
//         userEmail: auth.user.email,
//         messages: [
//           { sender: "user", text: message },
//           { sender: "bot", text: reply },
//         ],
//       });
//     }

//     if (Alluser.hasPaid == false) {
//       Alluser.freeMessagesUsed++;
//       await Alluser.save();
//     }

//     const allChats = await chatModel.find({ userEmail: auth.user.email });

//     return Response.json({
//       Allchat: allChats,
//       activeChatId: Chat._id,
//     });
//   } catch (err) {
//     console.log(err);
//     return Response.json({ reply: "Error happened." }, { status: 500 });
//   }
// }
