import { useContext, useState, useEffect } from "react";
import "../../App.css";
import { ChatPreview } from "../../interfaces/chat_preview.interface";
import { Link } from "react-router-dom";

interface ContactSliverProps {
    preview: ChatPreview;
}

const ChatSliver = ({ preview }: ContactSliverProps) => {
    const [isButton1Hovered, setIsButton1Hovered] = useState(false);

    return (
        <Link
            to={`/chat/${preview.CHATID}`}
            className={`block h-[60px] mx-5 ${
                isButton1Hovered ? "" : "hover:bg-slate-200"
            } rounded-xl`}
        >
            <div className="flex justify-between items-center h-full">
                <div className="text-black flex-grow justify-center items-center ml-[5%] text-wrap max-w-[70%] py-4">
                    {preview.display_name === ""
                        ? Object.values(preview.handle_ids)
                              .map((handleId) => {
                                  let name;
                                  if (handleId.Nickname) {
                                      name = handleId.Nickname;
                                  } else {
                                      const first = handleId.First || "";
                                      const last = handleId.Last || "";
                                      name =
                                          `${first} ${last}`.trim() ||
                                          handleId.id;
                                  }
                                  return name;
                              })
                              .join(",")
                        : preview.display_name}
                </div>
            </div>
        </Link>
    );
};

export default ChatSliver;
