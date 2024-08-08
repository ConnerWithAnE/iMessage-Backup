import { Message } from "../../interfaces/message.interface";

export interface MessageContentProps {
  message: Message
}

const MessageContent: React.FC<MessageContentProps> = ({ message }) => {
    let messageContent;
    let attachmentType: string;
    let typeExtension: string;

    const attachments = message.cache_has_attachments;

    if (!attachments) {
        messageContent = message.text;
    }

    if (message.attachment?.mime_type != null) {
        [attachmentType, typeExtension] =
            message.attachment.mime_type.split("/");
    }

    console.log(message.attachment);

    return (
        <div>
            {attachments ? (
              <div>
                <img
                    src={`data:${message.attachment?.mime_type};base64,${message.attachment?.data}`}
                    alt={`${message.attachment?.filename}`}
                    
                ></img>
                <p>{message.text}</p>
                </div>
            ) : (
                message.text
            )}
        </div>
    );
}

export default MessageContent;
