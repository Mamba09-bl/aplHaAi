import chatModel from "@/modules/chat";

export async function DELETE(req, { params }) {
  const { id } = await params;
  console.log("Deleting chat:", id);
  const del = await chatModel.findByIdAndDelete(id);
  console.log(del);

  return Response.json({ success: true });
}
